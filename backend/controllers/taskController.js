const Task = require('../models/Task');

// @route   GET api/todos
// @desc    Get all user's tasks
// @access  Private
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   POST api/todos
// @desc    Add a new task
// @access  Private
exports.createTask = async (req, res) => {
  const { text, description, date, time, timeAmPm } = req.body;

  try {
    const newTask = new Task({
      text,
      description,
      date,
      time,
      timeAmPm,
      user: req.user.id
    });

    const task = await newTask.save();
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   PATCH api/todos/:id
// @desc    Update a task
// @access  Private
exports.updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    // Make sure user owns task
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    task = await Task.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });

    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   DELETE api/todos/:id
// @desc    Delete a task
// @access  Private
exports.deleteTask = async (req, res) => {
    try {
      let task = await Task.findById(req.params.id);
  
      if (!task) {
        return res.status(404).json({ msg: 'Task not found' });
      }
  
      // Make sure user owns task
      if (task.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'Not authorized' });
      }
  
      // THE FIX IS HERE
      await Task.findByIdAndDelete(req.params.id);
  
      res.json({ msg: 'Task removed' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  };