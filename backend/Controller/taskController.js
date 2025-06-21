// controllers/taskController.js
const { createTask,getTasksByUserId } = require("../model/taskModel");

const createTaskController = async (req, res) => {
    try {
      const { title, estimated_duration } = req.body;
      
  
      // Basic validation
      if (!title || estimated_duration === undefined) {
        return res.status(400).json({
          success: false,
          error: "Both 'title' and 'estimated_duration' are required.",
        });
      }
  
      // Add authenticated user ID to task data
      const taskData = {
        ...req.body,
        user_id: req.uid,
      };
  
      // Create task
      const newTask = await createTask(taskData);
  
      // Return created task
      res.status(201).json({
        success: true,
        message: "Task created successfully.",
        task: newTask,
      });
  
    } catch (error) {
      console.error("Error in createTaskController:", error.message);
      res.status(400).json({
        success: false,
        error: error.message || "Something went wrong.",
      });
    }
  };

  const getTasksController = async (req, res) => {
    try {
      const userId = req.uid; // ✅ From auth middleware
      const tasks = await getTasksByUserId(userId);
  
      res.status(200).json({ success: true, tasks });
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ success: false, error: "Failed to fetch tasks" });
    }
  };
  

module.exports = {
  createTaskController,
  getTasksController
};
