const moment = require('moment-timezone'); // Use moment-timezone
const logger = require('../logger'); // Import the logger

/**
 * Function to handle task completion.
 * @param {Object} task - The task object.
 * @param {String} timezone - The user's timezone.
 * @returns {Object} - The updated task object with new due date and reset completion percentage.
 */
async function handleTaskCompletion(task, timezone = 'UTC') {
	const currentTime = moment().tz(timezone); // Get the current time and date in the specified timezone
	logger.info('Handling task completion', { taskId: task.tid, timezone });

	// Determine the new due date based on the occurrence and number of occurrences
	let newDueDate;
	try {
		if (task.completed_count < task.number_occurrences - 1) {
			task.completed_count += 1;
			switch (task.occurrence.toLowerCase()) {
				case 'daily':
					newDueDate = currentTime
						.add(1, 'days')
						.subtract(
							(task.number_occurrences - task.completed_count) *
								1,
							'days'
						);
					break;
				case 'bi-weekly':
					newDueDate = currentTime
						.add(2, 'weeks')
						.subtract(
							((task.number_occurrences - task.completed_count) *
								14) /
								task.number_occurrences,
							'days'
						);
					break;
				case 'weekly':
					newDueDate = currentTime
						.add(1, 'weeks')
						.subtract(
							((task.number_occurrences - task.completed_count) *
								7) /
								task.number_occurrences,
							'days'
						);
					break;
				case 'bi-monthly':
					newDueDate = currentTime
						.add(2, 'months')
						.subtract(
							((task.number_occurrences - task.completed_count) *
								60) /
								task.number_occurrences,
							'days'
						);
					break;
				case 'monthly':
					newDueDate = currentTime
						.add(1, 'months')
						.subtract(
							((task.number_occurrences - task.completed_count) *
								30) /
								task.number_occurrences,
							'days'
						);
					break;
				case 'quarterly':
					newDueDate = currentTime
						.add(3, 'months')
						.subtract(
							((task.number_occurrences - task.completed_count) *
								90) /
								task.number_occurrences,
							'days'
						);
					break;
				default:
					throw new Error('Unsupported occurrence type');
			}
		} else {
			task.completed_count = 0;
			switch (task.occurrence.toLowerCase()) {
				case 'daily':
					newDueDate = currentTime.add(1, 'days');
					break;
				case 'bi-weekly':
					newDueDate = currentTime.add(2, 'weeks');
					break;
				case 'weekly':
					newDueDate = currentTime.add(1, 'weeks');
					break;
				case 'bi-monthly':
					newDueDate = currentTime.add(2, 'months');
					break;
				case 'monthly':
					newDueDate = currentTime.add(1, 'months');
					break;
				case 'quarterly':
					newDueDate = currentTime.add(3, 'months');
					break;
				default:
					throw new Error('Unsupported occurrence type');
			}
		}

		// Reset task properties
		task.due_date = newDueDate.format('YYYY-MM-DD HH:mm:ss'); // Convert to the required format
		task.completion_percentage = 0;
		task.status = 0;
		task.last_updated = currentTime.format('YYYY-MM-DD HH:mm:ss'); // Update last_updated to current time

		logger.info('Task completion handled successfully', {
			taskId: task.tid,
			newDueDate: task.due_date,
		});
		return task;
	} catch (error) {
		logger.error('Error handling task completion', {
			taskId: task.tid,
			error: error.message,
		});
		throw error;
	}
}

module.exports = handleTaskCompletion;
