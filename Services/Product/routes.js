const express = require('express');
const { isAdmin, verifyToken } = require('../../middlewares');
const { getProducts, getProduct, deleteProduct, updateProduct, createProduct } = require('./productController');
const router = express.Router();

router.route('/')
    .get(verifyToken, isAdmin, getProducts)
    .post(verifyToken, isAdmin, createProduct)

router.route('/:id')
    .get(verifyToken, isAdmin, getProduct)
    .put(verifyToken, isAdmin, updateProduct)
    .delete(verifyToken, isAdmin, deleteProduct)

module.exports = router;