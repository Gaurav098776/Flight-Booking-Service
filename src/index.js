const express = require('express');
const { ServerConfig } = require('./config');
const apiRoutes = require('./routes');
const CRONS = require('./utils/common/cron-job'); // ✅ fixed


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRoutes);

app.listen(ServerConfig.PORT, () => {
  console.log(`Server is running on port ${ServerConfig.PORT}`);
  CRONS();
});
