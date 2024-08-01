const express = require('express');
const dotenv = require('dotenv');
const userRoutes = require('./routes')
const pool = require('./db');

dotenv.config();

const app = express();
app.use(express.json());
app.use('/users', userRoutes);

const port = process.env.DB_PORT || 3000;
app.listen(port, () => {
  console.log(`User service running on port ${port}`);
});