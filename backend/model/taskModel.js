// models/taskModel.js
const { v4: uuidv4 } = require("uuid");
const { db } = require("./db");

const createTask = async (taskData) => {
  const taskId = uuidv4();
  const createdAt = new Date();

  const taskDoc = {
    id: taskId,
    user_id: taskData.user_id,
    title: taskData.title,
    description: taskData.description || "",
    priority: taskData.priority || "medium", // validate enum in API
    tags: taskData.tags || [],
    estimated_duration: taskData.estimated_duration || 0,
    deadline: taskData.deadline ? new Date(taskData.deadline) : null,
    completed: false,
    completed_at: null,
    created_at: createdAt,
    scheduled_time: taskData.scheduled_time || null,
    scheduled_date: taskData.scheduled_date ? new Date(taskData.scheduled_date) : null,
    actual_duration: taskData.actual_duration || null,
    routine_id: taskData.routine_id || null,
    is_recurring: taskData.is_recurring || false,
    parent_recurring_id: taskData.parent_recurring_id || null,
  };

  await db.collection("tasks").doc(taskId).set(taskDoc);
  return taskDoc;
};

const convertTimestamps = (data) => {
  const result = {};
  for (const [key, value] of Object.entries(data)) {
    result[key] = value?.toDate ? value.toDate() : value;
  }
  return result;
};

const getTasksByUserId = async (userId) => {
  const snapshot = await db
    .collection("tasks")
    .where("user_id", "==", userId)
    .get();

  const tasks = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...convertTimestamps(doc.data()),
  }));

  return tasks;
};

module.exports = { createTask,getTasksByUserId};
