const express = require('express');
const router = express.Router();
const { pool } = require('../utils/db');
const handleTaskCompletion = require('../lib/task');
const logger = require('../logger'); // Import the logger

// Create a task
router.post('/', async (req, res) => {
	try {
		const {
			uid,
			title,
			occurrence,
			number_occurrences,
			category,
			completion_percentage,
			notes,
			priority,
		} = req.body;
		const result = await pool.query(
			'INSERT INTO tasks (uid, title, occurrence, number_occurrences, category, completion_percentage, notes, priority) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
			[
				uid,
				title,
				occurrence,
				number_occurrences,
				category,
				completion_percentage,
				notes,
				priority,
			]
		);
		if (result.rows.length === 0) {
			logger.warn('Task not created');
			res.status(404).json({ error: 'Task not created' });
		} else {
			logger.info('Task created successfully', { task: result.rows[0] });
			res.status(201).json(result.rows[0]);
		}
	} catch (err) {
		logger.error('Error creating task', { error: err.message });
		res.status(500).json({ error: err.message });
	}
});

// Read a task
router.get('/:taskId', async (req, res) => {
	try {
		const { taskId } = req.params;
		const result = await pool.query('SELECT * FROM tasks WHERE tid = $1', [
			taskId,
		]);
		if (result.rows.length === 0) {
			logger.warn(`Task with id ${taskId} not found`);
			res.status(404).json({ error: 'Task not found' });
		} else {
			logger.info('Task retrieved successfully', {
				task: result.rows[0],
			});
			res.json(result.rows[0]);
		}
	} catch (err) {
		logger.error('Error retrieving task', { error: err.message });
		res.status(500).json({ error: err.message });
	}
});

// Update a task
router.put('/:taskId', async (req, res) => {
	try {
		const { taskId } = req.params;
		const {
			title,
			occurrence,
			number_occurrences,
			category,
			completion_percentage,
			notes,
			priority,
		} = req.body;

		const existingTaskResult = await pool.query(
			'SELECT * FROM tasks WHERE tid = $1',
			[taskId]
		);
		const existingTask = existingTaskResult.rows[0];

		if (!existingTask) {
			logger.warn(`Task with id ${taskId} not found`);
			return res.status(404).json({ error: 'Task not found' });
		}

		let updatedTask = {
			title: title || existingTask.title,
			occurrence: occurrence || existingTask.occurrence,
			number_occurrences:
				number_occurrences || existingTask.number_occurrences,
			category: category || existingTask.category,
			completion_percentage:
				completion_percentage || existingTask.completion_percentage,
			notes: notes || existingTask.notes,
			priority: priority || existingTask.priority,
			last_updated: new Date(),
		};

		const result = await pool.query(
			'UPDATE tasks SET title = $1, occurrence = $2, category = $3, completion_percentage = $4, notes = $5, priority = $6, number_occurrences = $7, last_updated = $8 WHERE tid = $9 RETURNING *',
			[
				updatedTask.title,
				updatedTask.occurrence,
				updatedTask.category,
				updatedTask.completion_percentage,
				updatedTask.notes,
				updatedTask.priority,
				updatedTask.number_occurrences,
				updatedTask.last_updated,
				taskId,
			]
		);

		// Check if the task completion percentage is updated to 100%
		if (updatedTask.completion_percentage === 100) {
			updatedTask.status = 2;

			const userTzResult = await pool.query(
				'SELECT timezone FROM users WHERE uid = $1',
				[existingTask.uid]
			);
			updatedTask = await handleTaskCompletion(
				updatedTask,
				userTzResult.rows[0].timezone
			);

			const furtherUpdates = await pool.query(
				'UPDATE tasks SET completion_percentage = $1, status = $2, due_date = $3, completed_count = $4, last_updated = $5 WHERE tid = $6 RETURNING *',
				[
					updatedTask.completion_percentage,
					updatedTask.status,
					updatedTask.due_date,
					updatedTask.completed_count,
					updatedTask.last_updated,
					taskId,
				]
			);
			logger.info('Task updated and marked as completed', {
				task: furtherUpdates.rows[0],
			});
			res.json(furtherUpdates.rows[0]);
		} else {
			logger.info('Task updated successfully', { task: result.rows[0] });
			res.json(result.rows[0]);
		}
	} catch (err) {
		logger.error('Error updating task', { error: err.message });
		res.status(500).json({ error: err.message });
	}
});

// Complete a task
router.post('/:taskId/complete', async (req, res) => {
	try {
		const { taskId } = req.params;

		const existingTaskResult = await pool.query(
			'SELECT * FROM tasks WHERE tid = $1',
			[taskId]
		);
		const existingTask = existingTaskResult.rows[0];
		if (!existingTask) {
			logger.warn(`Task with id ${taskId} not found`);
			return res.status(404).json({ error: 'Task not found' });
		}

		const userTzResult = await pool.query(
			'SELECT timezone FROM users WHERE uid = $1',
			[existingTask.uid]
		);
		const userTz = userTzResult.rows[0].timezone;

		let updatedTask = await handleTaskCompletion(existingTask, userTz);

		const result = await pool.query(
			'UPDATE tasks SET completion_percentage = $1, status = $2, due_date = $3, completed_count = $4, last_updated = $5 WHERE tid = $6 RETURNING *',
			[
				updatedTask.completion_percentage,
				updatedTask.status,
				updatedTask.due_date,
				updatedTask.completed_count,
				updatedTask.last_updated,
				taskId,
			]
		);

		logger.info('Task marked as completed', { task: result.rows[0] });
		res.json(result.rows[0]);
	} catch (err) {
		logger.error('Error completing task', { error: err.message });
		res.status(500).json({ error: err.message });
	}
});

// Delete a task
router.delete('/:taskId', async (req, res) => {
	try {
		const { taskId } = req.params;
		const result = await pool.query(
			'DELETE FROM tasks WHERE tid = $1 RETURNING *',
			[taskId]
		);

		if (result.rowCount === 0) {
			logger.warn(`Task with id ${taskId} not found`);
			return res.status(404).json({ error: 'Task not found' });
		}

		logger.info('Task deleted successfully', { task: result.rows[0] });
		res.json(result.rows[0]);
	} catch (err) {
		logger.error('Error deleting task', { error: err.message });
		res.status(500).json({ error: err.message });
	}
});

module.exports = router;
