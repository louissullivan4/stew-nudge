const express = require('express');
const router = express.Router();
const { pool } = require('../utils/db');
const logger = require('../logger'); // Import the logger

// Read a user
router.get('/:userId', async (req, res) => {
	try {
		const { userId } = req.params;
		const result = await pool.query('SELECT * FROM users WHERE uid = $1', [
			userId,
		]);
		if (result.rows.length === 0) {
			logger.warn(`User with id ${userId} not found`);
			res.status(404).json({ error: 'User not found' });
		} else {
			logger.info('User retrieved successfully', {
				user: result.rows[0],
			});
			res.json(result.rows[0]);
		}
	} catch (err) {
		logger.error('Error retrieving user', { error: err.message });
		res.status(500).json({ error: err.message });
	}
});

// Create a user
router.post('/', async (req, res) => {
	try {
		const {
			email,
			username,
			first_name,
			last_name,
			phone_number,
			timezone,
			subscription,
			birthday,
		} = req.body;
		const result = await pool.query(
			'INSERT INTO users (email, username, first_name, last_name, phone_number, timezone, subscription, birthday) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
			[
				email,
				username,
				first_name,
				last_name,
				phone_number,
				timezone,
				subscription,
				birthday,
			]
		);
		if (result.rows.length === 0) {
			logger.warn('User not created');
			res.status(404).json({ error: 'User not created' });
		} else {
			const getCreatedUserId = result.rows[0].uid;
			logger.info('User created successfully', {
				userId: getCreatedUserId,
			});
			res.status(201).json({ uid: getCreatedUserId });
		}
	} catch (err) {
		logger.error('Error creating user', { error: err.message });
		res.status(500).json({ error: err.message });
	}
});

// Update a user
router.put('/:userId', async (req, res) => {
	try {
		const { userId } = req.params;
		const {
			email,
			username,
			first_name,
			last_name,
			phone_number,
			timezone,
			subscription,
			birthday,
		} = req.body;

		const existingUserResult = await pool.query(
			'SELECT * FROM users WHERE uid = $1',
			[userId]
		);
		const existingUser = existingUserResult.rows[0];

		if (!existingUser) {
			logger.warn(`User with id ${userId} not found`);
			return res.status(404).json({ error: 'User not found' });
		}

		const updatedUser = {
			email: email || existingUser.email,
			username: username || existingUser.username,
			first_name: first_name || existingUser.first_name,
			last_name: last_name || existingUser.last_name,
			phone_number: phone_number || existingUser.phone_number,
			timezone: timezone || existingUser.timezone,
			subscription:
				subscription !== undefined
					? subscription
					: existingUser.subscription,
			birthday: birthday || existingUser.birthday,
		};

		const result = await pool.query(
			'UPDATE users SET email = $1, username = $2, first_name = $3, last_name = $4, phone_number = $5, timezone = $6, subscription = $7, birthday = $8 WHERE uid = $9 RETURNING *',
			[
				updatedUser.email,
				updatedUser.username,
				updatedUser.first_name,
				updatedUser.last_name,
				updatedUser.phone_number,
				updatedUser.timezone,
				updatedUser.subscription,
				updatedUser.birthday,
				userId,
			]
		);

		logger.info('User updated successfully', { user: result.rows[0] });
		res.json(result.rows[0]);
	} catch (err) {
		logger.error('Error updating user', { error: err.message });
		res.status(500).json({ error: err.message });
	}
});

// Delete a user
router.delete('/:userId', async (req, res) => {
	try {
		const { userId } = req.params;
		const result = await pool.query(
			'DELETE FROM users WHERE uid = $1 RETURNING *',
			[userId]
		);

		if (result.rowCount === 0) {
			logger.warn(`User with id ${userId} not found`);
			return res.status(404).json({ error: 'User not found' });
		}

		logger.info('User deleted successfully', { user: result.rows[0] });
		res.json(result.rows[0]);
	} catch (err) {
		logger.error('Error deleting user', { error: err.message });
		res.status(500).json({ error: err.message });
	}
});

module.exports = router;
