const express = require('express');
const router = express.Router();
const {pool} = require('../../db/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const { v4: uuid } = require('uuid');

router.post('/register', async (req, res) => {
         const { username, email, password } = req.body;
          if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
          }
         try {
            // Check if user already exists
            const userExistsQuery = `SELECT * FROM users WHERE email = $1`;
             const userExistsResult = await pool.query(userExistsQuery, [email]);

            if (userExistsResult.rows.length > 0) {
                return res.status(400).json({ message: 'User already exists' });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert new user into the database
            const registerUserQuery = `
            INSERT INTO users (username, password, email, isAdmin)
            VALUES ($1, $2, $3, $4) RETURNING *
            `;
            const userResult = await pool.query(registerUserQuery, [username, hashedPassword, email, false]);
            const newUser = userResult.rows[0];

            // Create a JWT token
            const token = jwt.sign({ id: newUser.id, email: newUser.email }, 'your_jwt_secret', { expiresIn: '1h' });
            return res.status(201).json({ token, user: { id: newUser.id, username: newUser.username, email: newUser.email } });
             
        } catch (error) {
            console.error('Error registering user:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
        
})

router.post('/login', async (req, res) => {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
            }
        try {
            // Check if user already exists
            const userExistsQuery = `SELECT * FROM users WHERE email = $1`;
            const userExistsResult = await pool.query(userExistsQuery, [email]);

            if (userExistsResult.rows.length > 0) {
                const user = userExistsResult.rows[0];
                const validUser = await bcrypt.compare(password, user.password);
                if (!validUser) {
                    return res.status(403).json({ message: 'Invalid email or password!' });
                }
                // Create a JWT token
                const token = jwt.sign({ id: user.id, email: user.email }, 'your_jwt_secret', { expiresIn: '1h' });
                return res.status(201).json({message: 'successfully logged in', token, user: { id: user.id, username: user.username, email: user.email } });
            }  
        } catch (error) {
            res.status(500).json({ message: 'Invalid login credentials' });
        }
})

module.exports = router;