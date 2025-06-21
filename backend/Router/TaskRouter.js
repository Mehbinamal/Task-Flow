const express = require('express');

const { createTaskController,getTasksController } = require('../Controller/taskController');
const validateTask = require('../Middlewear/validateTask');
const { verifyToken } = require('../Middlewear/AuthMiddlewear');

const router = express.Router();

router.post('/create-task', verifyToken, validateTask, createTaskController);
router.get('/get-tasks', verifyToken, getTasksController);

module.exports = router;

