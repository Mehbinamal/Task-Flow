// middleware/validateTask.js

const validateTask = (req, res, next) => {
    console.log(req.body);
    const {
      title,
      estimated_duration,
      priority,
      tags,
      scheduled_time,
      scheduled_date,
    } = req.body;
  
    // Check required fields
    if (!title || estimated_duration === undefined) {
      return res.status(400).json({
        success: false,
        error: "Both 'title' and 'estimated_duration' are required.",
      });
    }
  
    // Check priority
    const allowedPriorities = ["low", "medium", "high"];
    if (priority && !allowedPriorities.includes(priority)) {
      return res.status(400).json({
        success: false,
        error: "Priority must be 'low', 'medium', or 'high'.",
      });
    }
  
    // Optional: validate scheduled_time format (HH:MM)
    if (scheduled_time && !/^\d{2}:\d{2}$/.test(scheduled_time)) {
      return res.status(400).json({
        success: false,
        error: "Invalid 'scheduled_time' format. Expected HH:MM.",
      });
    }
  
    // Optional: validate scheduled_date format (yyyy-mm-dd)
    if (scheduled_date && !/^\d{4}-\d{2}-\d{2}$/.test(scheduled_date)) {
      return res.status(400).json({
        success: false,
        error: "Invalid 'scheduled_date' format. Expected YYYY-MM-DD.",
      });
    }
  
    // Optional: validate tags (should be array)
    if (tags && !Array.isArray(tags)) {
      return res.status(400).json({
        success: false,
        error: "'tags' must be an array.",
      });
    }
    
    next(); 
  };
  
  module.exports = validateTask;
  