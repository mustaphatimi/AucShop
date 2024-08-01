const express = require('express');
const dotenv = require('dotenv');
const productRoutes = require('./routes')

dotenv.config();

const app = express();
app.use(express.json());
app.use('/products', productRoutes);

const port = process.env.DB_PORT || 3000;
app.listen(port, () => {
  console.log(`Product service running on port ${port}`);
});