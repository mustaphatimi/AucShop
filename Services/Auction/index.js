// auction-service/index.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { placeBid } = require('./auctionController');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('joinAuction', (auctionId) => {
    socket.join(auctionId);
    console.log(`Client ${socket.id} joined auction ${auctionId}`);
  });

  socket.on('placeBid', async ({ auctionId, bid }) => {
    const updatedAuction = await placeBid(auctionId, bid);
    io.to(auctionId).emit('bidPlaced', updatedAuction);
  });

  socket.on('startAuction', async (auctionId) => {
    const auction = await startAuction(auctionId);
    io.to(auctionId).emit('auctionStarted', auction);
  });

  socket.on('endAuction', async (auctionId) => {
    const auction = await endAuction(auctionId);
    io.to(auctionId).emit('auctionEnded', auction);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

server.listen(3005, () => {
  console.log('Auction service listening on port 3005');
});

