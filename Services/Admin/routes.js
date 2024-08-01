const express = require('express');
const { isAdmin, verifyToken } = require('../../middlewares');
const { getUsers, getUser, deleteUser, addProduct, updateProduct, deleteProduct } = require('./adminController');
const router = express.Router();

router.route('/users')
    .get(verifyToken, isAdmin, getUsers)

router.route('/users/:id')
    .get(verifyToken, isAdmin, getUser)
    .delete(verifyToken, isAdmin, deleteUser)

router.route('/products')
    .post(verifyToken, isAdmin, addProduct)

router.route('/products/:id')
    .put(verifyToken, isAdmin, updateProduct)
    .delete(verifyToken, isAdmin, deleteProduct)

module.exports = router;