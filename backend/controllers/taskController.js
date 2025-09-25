const Task = require('../models/Task');

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

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

exports.updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

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

exports.deleteTask = async (req, res) => {
    try {
      let task = await Task.findById(req.params.id);
  
      if (!task) {
        return res.status(404).json({ msg: 'Task not found' });
      }
  
      if (task.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'Not authorized' });
      }

      await Task.findByIdAndDelete(req.params.id);
  
      res.json({ msg: 'Task removed' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  };