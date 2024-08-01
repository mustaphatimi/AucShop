const express = require('express');
const dotenv = require('dotenv');
const adminRoutes = require('./routes')
const pool = require('./db');

dotenv.config();

const app = express();
app.use(express.json());
app.use('/admin', adminRoutes);

const port = process.env.DB_PORT || 3000;
app.listen(port, () => {
  console.log(`Admin service running on port ${port}`);
});