import mongoose from 'mongoose';

// Schema
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  dueDate: {
    type: String,
    default: '',
  },
  completed: {
    type: Boolean,
    default: false,
  },
  dateCreated: {
    type: String,
    default: () => new Date(Date.now()).toLocaleDateString(),
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    requried: true,
    ref: 'User',
  }
});

// Model
const Task = mongoose.model('Task', taskSchema);

export default Task;