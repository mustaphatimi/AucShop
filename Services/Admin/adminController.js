const express = require('express');
const router = express.Router();
const { isAdmin } = require('../../middlewares');
const { pool } = require('../../db');

const getUsers = async (req, res, next) => {
    try {
        const query = `SELECT * FROM users`;
        const user = await pool.query(query);
        if (!user.rows) {
            throw new Error('Users not found', 404)
        }
        return res.status(200).json({users: user.rows})
    } catch (error) {
        next(error)
    }

}

const getUser = async (req, res, next) => {
        const { id } = req.params;
        try {
            const query = `SELECT * FROM users WHERE id = $1`;
            let user = await pool.query(query, [id]);
            if (!user.rows[0]) {
                throw new Error('User ID not found', 404)
            }
            user = {...req.body }
            return res.status(201).json({user})
        } catch (error) {
            next(error)
        }
}
    
const deleteUser = async (req, res, next) => {
        const { id } = req.params;
        try {
            const query = `DELETE * FROM users WHERE id = $1`;
            let user = await pool.query(query, [id]);
            if (!user.rows[0]) {
                throw new Error('User ID not found', 404)
            }
            return res.status(202).json({message: 'User successfully deleted', user})
        } catch (error) {
            next(error)
        }
}

const addProduct = async (req, res, next) => {
        const { name, description, price } = req.body;
        if (!name || !description || !price) {
            throw new Error('All fields are required', 400)
        }
        try {
            const addProductQuery = `
                INSERT INTO products (name, description, price)
                VALUES ($1, $2, $3) RETURNING *
                `;
            const result = await pool.query(addProductQuery, [name, description, price]);
            if (!result.rows) {
                throw new Error ('Error adding product', 401)
            }
            const newProduct = result.rows[0];
            return res.status(201).json({message: 'Product added successfully', product: newProduct});
            
        } catch (error) {
            next(error)
        }
    }

const updateProduct = async (req, res, next) => {
        const { id } = req.params;
        const { name, description, price } = req.body;
        try {
            const query = `SELECT * FROM products WHERE id = $1`;
            let product = await pool.query(query, [id]);
            if (!product.rows[0]) {
                throw new Error('Product ID not found', 404)
            }
            product.name = name;
            product.description = description;
            product.price = price;
            return res.status(201).json({message: 'Product successfully updated', product})
        } catch (error) {
            next(error)
        }
}
    
const deleteProduct = async (req, res, next) => {
        const { id } = req.params;
        try {
            const query = `DELETE * FROM products WHERE id = $1`;
            let product = await pool.query(query, [id]);
            if (!product.rows[0]) {
                throw new Error('Product ID not found', 404)
            }
            return res.status(202).json({message: 'Product successfully deleted', product})
        } catch (error) {
            next(error)
        }
}

module.exports = {
    getUsers,
    getUser,
    deleteUser,
    addProduct,
    deleteProduct,
    updateProduct
};