require('dotenv').config({
	path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env.dev',
});

module.exports = {
	user: process.env.PG_USER || 'postgres',
	host: process.env.PG_HOST || 'localhost',
	database: process.env.PG_DATABASE || 'nudge',
	password: process.env.PG_PASSWORD,
	port: process.env.PG_PORT || 5432,
};
