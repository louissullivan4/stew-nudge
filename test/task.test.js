/* eslint-disable no-undef */
const handleTaskCompletion = require('../routes/lib/task');
const moment = require('moment-timezone');

describe('handleTaskCompletion', () => {
	const timezone = 'America/New_York';

	it('should handle daily tasks with multiple occurrences correctly', async () => {
		const task = {
			completed_count: 0,
			number_occurrences: 2,
			occurrence: 'daily',
			completion_percentage: 50,
		};
		const updatedTask = await handleTaskCompletion(task, timezone);

		expect(updatedTask.completed_count).toBe(1);
		expect(updatedTask.completion_percentage).toBe(0);
		const expectedDueDate = moment()
			.tz(timezone)
			.add(1, 'days')
			.subtract(1, 'days')
			.format('YYYY-MM-DD HH:mm:ss');
		expect(updatedTask.due_date).toBe(expectedDueDate);
	});

	it('should handle bi-weekly tasks with multiple occurrences correctly', async () => {
		const task = {
			completed_count: 1,
			number_occurrences: 2,
			occurrence: 'bi-weekly',
			completion_percentage: 50,
		};
		const updatedTask = await handleTaskCompletion(task, timezone);

		expect(updatedTask.completed_count).toBe(0);
		expect(updatedTask.completion_percentage).toBe(0);
		const expectedDueDate = moment()
			.tz(timezone)
			.add(2, 'weeks')
			.format('YYYY-MM-DD HH:mm:ss');
		expect(updatedTask.due_date).toBe(expectedDueDate);
	});

	it('should handle weekly tasks with multiple occurrences correctly', async () => {
		const task = {
			completed_count: 1,
			number_occurrences: 2,
			occurrence: 'weekly',
			completion_percentage: 50,
		};
		const updatedTask = await handleTaskCompletion(task, timezone);

		expect(updatedTask.completed_count).toBe(0);
		expect(updatedTask.completion_percentage).toBe(0);
		const expectedDueDate = moment()
			.tz(timezone)
			.add(1, 'weeks')
			.format('YYYY-MM-DD HH:mm:ss');
		expect(updatedTask.due_date).toBe(expectedDueDate);
	});

	it('should handle bi-monthly tasks correctly', async () => {
		const task = {
			completed_count: 0,
			number_occurrences: 1,
			occurrence: 'bi-monthly',
			completion_percentage: 50,
		};
		const updatedTask = await handleTaskCompletion(task, timezone);

		expect(updatedTask.completed_count).toBe(0);
		expect(updatedTask.completion_percentage).toBe(0);
		const expectedDueDate = moment()
			.tz(timezone)
			.add(2, 'months')
			.format('YYYY-MM-DD HH:mm:ss');
		expect(updatedTask.due_date).toBe(expectedDueDate);
	});

	it('should handle monthly tasks correctly', async () => {
		const task = {
			completed_count: 0,
			number_occurrences: 1,
			occurrence: 'monthly',
			completion_percentage: 50,
		};
		const updatedTask = await handleTaskCompletion(task, timezone);

		expect(updatedTask.completed_count).toBe(0);
		expect(updatedTask.completion_percentage).toBe(0);
		const expectedDueDate = moment()
			.tz(timezone)
			.add(1, 'months')
			.format('YYYY-MM-DD HH:mm:ss');
		expect(updatedTask.due_date).toBe(expectedDueDate);
	});

	it('should handle quarterly tasks correctly', async () => {
		const task = {
			completed_count: 0,
			number_occurrences: 1,
			occurrence: 'quarterly',
			completion_percentage: 50,
		};
		const updatedTask = await handleTaskCompletion(task, timezone);

		expect(updatedTask.completed_count).toBe(0);
		expect(updatedTask.completion_percentage).toBe(0);
		const expectedDueDate = moment()
			.tz(timezone)
			.add(3, 'months')
			.format('YYYY-MM-DD HH:mm:ss');
		expect(updatedTask.due_date).toBe(expectedDueDate);
	});

	it('should reset completed_count after reaching number_occurrences', async () => {
		const task = {
			completed_count: 1,
			number_occurrences: 2,
			occurrence: 'weekly',
			completion_percentage: 50,
		};
		const updatedTask = await handleTaskCompletion(task, timezone);

		expect(updatedTask.completed_count).toBe(0);
		expect(updatedTask.completion_percentage).toBe(0);
		const expectedDueDate = moment()
			.tz(timezone)
			.add(1, 'weeks')
			.format('YYYY-MM-DD HH:mm:ss');
		expect(updatedTask.due_date).toBe(expectedDueDate);
	});

	it('should throw an error for unsupported occurrence types', async () => {
		const task = {
			completed_count: 0,
			number_occurrences: 1,
			occurrence: 'yearly',
			completion_percentage: 50,
		};
		await expect(handleTaskCompletion(task, timezone)).rejects.toThrow(
			'Unsupported occurrence type'
		);
	});
});
