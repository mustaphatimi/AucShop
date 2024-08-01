const express = require('express');
const router = express.Router();
const { verifyToken } = require('../../middlewares');
const { placeBid, startAuction } = require('./auctionController');

router.post('/start', verifyToken, startAuction);
router.post('/bid', verifyToken, placeBid);

module.exports = router;