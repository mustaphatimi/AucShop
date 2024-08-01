const express = require('express');
const { verifyToken } = require('../../middlewares');
const { getOrders, createOrder, getOrder, updateOrder, deleteOrder } = require('./orderController');
const router = express.Router();

router.route('/')
    .get(verifyToken, getOrders)
    .post(verifyToken, createOrder)

router.route('/:id')
    .get(verifyToken, getOrder)
    .put(verifyToken, updateOrder)
    .delete(verifyToken, deleteOrder)

module.exports = router;