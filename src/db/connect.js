const mongoose = require('mongoose');

const connectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(process.env.MONGODB_URL, connectionOptions)
  .catch((err) => {
    console.log('Error on initial DB connection: ', err);
  });

mongoose.connection.on('error', (err) => {
  console.log('DB connection lost: ', err);
});

mongoose.connection.on('open', () => {
  console.log('Connected successfully to DB!');
});