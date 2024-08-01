const pool = require('../db');
const io = require('socket.io')(3001, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const startAuction = async (req, res) => {
  const { productId, startingBid } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO auctions (product_id, starting_bid, current_bid, status) VALUES ($1, $2, $2, $3) RETURNING *',
      [productId, startingBid, 'active']
    );
    const auction = result.rows[0];
    io.emit('auction_started', auction);
    res.status(201).json(auction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const placeBid = async (req, res) => {
  const { auctionId, bidAmount } = req.body;
  try {
    const result = await pool.query(
      'UPDATE auctions SET current_bid = $1 WHERE id = $2 AND status = $3 RETURNING *',
      [bidAmount, auctionId, 'active']
    );
    const auction = result.rows[0];
    if (!auction) {
      return res.status(400).json({ message: 'Auction not found or not active' });
    }
    io.emit('new_bid', auction);
    res.status(200).json(auction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});


module.exports = {
  startAuction,
  placeBid
}

// const auctions = {};

// async function placeBid(auctionId, bid) {
//   if (!auctions[auctionId]) {
//     throw new Error('Auction not found');
//   }

//   const auction = auctions[auctionId];
//   auction.bids.push(bid);

//   return auction;
// }

// async function startAuction(auctionId) {
//   auctions[auctionId] = { bids: [] };
//   return auctions[auctionId];
// }

// async function endAuction(auctionId) {
//   const auction = auctions[auctionId];
//   delete auctions[auctionId];
//   return auction;
// }

// module.exports = { placeBid, startAuction, endAuction };