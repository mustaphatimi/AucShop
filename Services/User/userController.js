const bcrypt = require('bcrypt');
const { createToken } = require('../../middlewares');
const { pool } = require('../../db');
// const { v4: uuid } = require('uuid');


const register = (async (req, res, next) => {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
                throw new Error('All fields are required', 400)
            }
            try {
                // Check if user already exists
                const userExistsQuery = `SELECT * FROM users WHERE email = $1`;
                const userExistsResult = await pool.query(userExistsQuery, [email]);
                if (userExistsResult.rows.length > 0) {
                    throw new Error('User already exists', 400)
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
                const token = createToken({ id: newUser.id, email: newUser.email });
                req.headers.authorization = `Bearer ${token}`;
                return res.status(201).json({ token, user: { id: newUser.id, username: newUser.username, email: newUser.email } });
            } catch (error) {
                next(error)
            }
        
})

const login = (async (req, res, next) => {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new Error('All fields are required', 400)
        }
        try {
            // Check if user already exists
            const userExistsQuery = `SELECT * FROM users WHERE email = $1`;
            const userExistsResult = await pool.query(userExistsQuery, [email]);

            if (userExistsResult.rows.length > 0) {
                const user = userExistsResult.rows[0];
                const validUser = await bcrypt.compare(password, user.password);
                if (!validUser) {
                    throw new Error('Invalid email or password', 403)
                }
                // Create a JWT token
                const token = createToken({ id: user.id, email: user.email })
                req.headers.authorization = `Bearer ${token}`
                return res.status(201).json({message: 'successfully logged in', token, user: { id: user.id, username: user.username, email: user.email } });
            }  
        } catch (error) {
            next(error)
        }
})

const userProfile = async (req, res, next) => {
    const { user } = req;
    if (!user) {
        throw new Error('You must be logged in', 402)
    }
    try {
        const userExistsQuery = `SELECT * FROM users WHERE email = $1`;
        const userExistsResult = await pool.query(userExistsQuery, [user.email]);
        if (!userExistsResult.rows[0]) {
            throw new Error('User not found', 404)
        }
        return res.status(202).json({userDetails: userExistsResult.rows[0]})
    } catch (error) {
        next (error)
    }
    }

const editProfile = async (req, res, next) => {
        const { username, password, newPassword, confPassword } = req.body;
        const { user } = req;
        try {
            if (!username || !password || !newPassword || !confPassword) {
                throw new Error('Fields cannot be empty', 400)
            }
            if (newPassword !== confPassword) {
                throw new Error('Passwords do not match', 400)
            }
            const userExistsQuery = `SELECT * FROM users WHERE email = $1`;
            const userExistsResult = await pool.query(userExistsQuery, [user.email]);

            const valid = await bcrypt.compare(password, userExistsResult.rows[0].password);
            if (!valid) {
               throw new Error('Invalid password..try again', 401)
            }
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            userExistsResult.rows[0].username = username;
            userExistsResult.rows[0].password = hashedPassword;
    
        return res.status(202).json({userDetails: userExistsResult.rows[0]})
    } catch (error) {
        next (error)
    }
}

module.exports = {
    register,
    login,
    userProfile,
    editProfile
};

