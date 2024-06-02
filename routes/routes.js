const express = require('express');
const router = express.Router();
const userRoutes = require('./userRoutes');
const taskRoutes = require('./taskRoutes');

// Use user routes
router.use('/users', userRoutes);

// Use task routes
router.use('/tasks', taskRoutes);

module.exports = router;
