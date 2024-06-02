const logger = require('./logger');
const { connectDatabase, clearDatabase } = require('./db');

// Check the startup mode
const startup = async () => {
	try {
		logger.info('Connecting to Database.');
		await connectDatabase();
		const mode = process.env.MODE;
		if (mode === 'all') {
			logger.info('All mode enabled, clearing databases.');
			await clearDatabase(['users']);
		}
		// Add other modes if needed
		logger.info('Startup completed successfully.');
	} catch (error) {
		logger.error(`Startup error: ${error.message}`);
	}
};

module.exports = startup;
