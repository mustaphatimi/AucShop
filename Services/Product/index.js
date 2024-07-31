const express = require('express');
const router = express.Router();
const { verifyToken } = require('../../middlewares');
const { pool } = require('../../db');


router.route('/')
    .get(verifyToken, async (req, res, next) => {
        try {
            const query = `SELECT * FROM products`;
            const products = await pool.query(query);
            if (!products.rows) {
                throw new Error('Products not found', 404)
            }
            return res.status(200).json({products: products.rows})
        } catch (error) {
            next(error)
        }
    })
    .post(verifyToken, async (req, res, next) => {
    // const { name, description, price, time, startPrice } = req.body;
    //     if (!name || !description || !price) {
    //         throw new Error('All fields are required', 400)
    //     }
    //     try {
    //         const addProductQuery = `
    //             INSERT INTO products (name, description, price)
    //             VALUES ($1, $2, $3) RETURNING *
    //             `;
    //         const result = await productsPool.query(addProductQuery, [name, description, price]);
    //         if (!result.rows) {
    //             throw new Error ('Error adding product', 401)
    //         }
    //         const newProduct = result.rows[0];
    //         return res.status(201).json({message: 'Product added successfully', product: newProduct});
            
    //     } catch (error) {
    //         next(error)
    //     }
})

module.exports = router;