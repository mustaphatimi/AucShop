const auctions = {};

async function placeBid(auctionId, bid) {
  if (!auctions[auctionId]) {
    throw new Error('Auction not found');
  }

  const auction = auctions[auctionId];
  auction.bids.push(bid);

  return auction;
}

async function startAuction(auctionId) {
  auctions[auctionId] = { bids: [] };
  return auctions[auctionId];
}

async function endAuction(auctionId) {
  const auction = auctions[auctionId];
  delete auctions[auctionId];
  return auction;
}

module.exports = { placeBid, startAuction, endAuction };