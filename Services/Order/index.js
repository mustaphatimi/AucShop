const express = require('express');
const dotenv = require('dotenv');
const orderRoutes = require('./routes')

dotenv.config();

const app = express();
app.use(express.json());
app.use('/orders', orderRoutes);

const port = process.env.DB_PORT || 3000;
app.listen(port, () => {
  console.log(`Order service running on port ${port}`);
});