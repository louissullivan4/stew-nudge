const { Pool } = require('pg');
const logger = require('./logger');
const config = require('../config');

const pool = new Pool({
	user: config.user,
	host: config.host,
	database: config.database,
	password: config.password,
	port: config.port,
});

async function connectDatabase() {
	try {
		const client = await pool.connect();
		logger.info('PostgreSQL Connected');
		client.release();
	} catch (err) {
		logger.error(`Database connection error: ${err.message}`);
	}
}

async function clearDatabase(tables) {
	try {
		const client = await pool.connect();
		for (const table of tables) {
			await client.query(`DELETE FROM ${table}`);
		}
		client.release();
		logger.info('Database cleared successfully.');
	} catch (error) {
		logger.error(`Error clearing database: ${error.message}`);
	}
}

async function disconnectDatabase() {
	try {
		await pool.end();
		logger.info('PostgreSQL Disconnected');
	} catch (err) {
		logger.error(`Database disconnection error: ${err.message}`);
	}
}

module.exports = { pool, connectDatabase, clearDatabase, disconnectDatabase };
