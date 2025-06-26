const express = require('express');
const { ServerConfig , Queue} = require('./config');
const apiRoutes = require('./routes');
const CRONS = require('./utils/common/cron-job'); // ✅ fixed
const amqplib =  require('amqplib')





const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRoutes);

app.listen(ServerConfig.PORT, async() => {
  console.log(`Server is running on port ${ServerConfig.PORT}`);
  CRONS();
  await Queue.connectQueue();
  console.log('queue');
  
});
