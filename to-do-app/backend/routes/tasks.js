import express from 'express';
import Task from '../models/TaskModel.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

// ===================================================================
// GET - View all tasks
// ===================================================================

router.get('/', authenticateToken, async (req, res) => {
  console.log('GET /tasks - Returning all of our tasks');
  try {
    const tasks = await Task.find({ userId: req.user.id });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching all tasks' });
  }
});

// ===================================================================
// POST - Create new Task
// ===================================================================
router.post('/', authenticateToken, async (req, res) => {
  console.log('POST /tasks - Creating a new task');
  console.log('Request body:', req.body);

  // Get task data from request body
  const { title, description, dueDate } = req.body;

  try {
    if (!title) {
      return res.status(400).json({ error: 'Task title is required' });
    } else {
      const newTask = new Task({
        title: title,
        description: description || '',
        dueDate: dueDate || '',
        userId: req.user.id // ADD THIS LINE HERE !!!!
      });

      const savedTask = await newTask.save();
      console.log('Task created:', savedTask);

      res.status(201).json(savedTask);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error creating task' });
  }
});

// ===================================================================
// PATCH - Update Task to "completed = true"
// ===================================================================
router.patch('/:id/complete', authenticateToken, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { completed: true },
      // { new: true }, <---- OLD (delete this)
      { returnDocument: 'after' }, // <---- NEW 
    );

    if (!task) {
      res.status(404).json({ error: 'Task not found' });
    } else {
      console.log('Task completion status updated:', task);
      res.json(task);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error updating task' });
  }
});

// ===================================================================
// PATCH - Update Task to "completed = false"
// ===================================================================

router.patch('/:id/incomplete', authenticateToken, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { completed: false },
      { returnDocument: 'after' },
    );

    if (!task) {
      res.status(404).json({ error: 'Task not found' });
    } else {
      console.log('Task completion status updated:', task);
      res.json(task);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error updating task' });
  }
});

// ===================================================================
// DELETE - Delete specific tasks
// ===================================================================
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      res.status(404).json({ error: 'Task not found' });

    } else {
      console.log('Task deleted', deletedTask);
      res.json({ message: 'Task deleted successfully', task: deletedTask });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error deleting task' });
  }
});

export default router;

// =======================================================
// HTTP Methods / CRUD - Create, Read, Update, Delete
// =======================================================

// GET - Retrieve data
// POST - Create data
// PUT - Updates entire data
// PATCH - Updates part of the data
// DELETE - Remove data

// 200 — OK (success)
// 201 — Created (new resource created)
// 400 — Bad Request (client error, like missing data)
// 404 — Not Found (resource doesn't exist)
// 500 — Internal Server Error (server problem)