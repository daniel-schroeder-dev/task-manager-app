const mongoose = require('mongoose');
const Task = require('../models/task');
const TaskList = require('../models/taskList');

require('dotenv').config();

const flush = async () => {
  const res = await Task.deleteMany({});
  console.log(`Removed ${res.deletedCount} Tasks.`);
  const taskListRes = await TaskList.updateMany({}, { $unset: { tasks: [] }});
  console.log(`Unset ${taskListRes.nModified} taskList.tasks`);
};

const connectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
};

mongoose.connect(process.env.MONGODB_URL, connectionOptions)
  .catch((err) => {
    console.log('Error on initial DB connection: ', err);
  });

mongoose.connection.on('error', (err) => {
  console.log('DB connection lost: ', err);
});

mongoose.connection.on('open', async () => {
  console.log('Connected successfully to DB!');
  await flush();
  mongoose.connection.close();
});


