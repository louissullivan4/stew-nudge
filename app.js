const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const { disconnectDatabase } = require('./utils/db');
const logger = require('./utils/logger');
const startup = require('./utils/startup');

const apiRouter = require('./routes/routes');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

app.use('/api', apiRouter);
    
const startServer = async () => {
    await startup();
    app.listen(port, () => {
        logger.info(`Server is running on port ${port}`);
    });
};

const shutdown = async () => {
    await disconnectDatabase();
    app.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
    });
};
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

startServer();

module.exports = app;
