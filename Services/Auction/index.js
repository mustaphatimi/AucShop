const express = require('express');
const dotenv = require('dotenv');
const auctionRoutes = require('./routes');

dotenv.config();

const app = express();
app.use(express.json());
app.use('/auction', auctionRoutes);

const port = process.env.DB_PORT || 3000;
app.listen(port, () => {
  console.log(`Auction service running on port ${port}`);
});

