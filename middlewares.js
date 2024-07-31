const jwt = require('jsonwebtoken');
const { pool } = require('./db');


const createToken = (data) => {
    return jwt.sign(data, process.env.SECRET_KEY, { expiresIn: '1h' })
}

const verifyToken = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return next(new Error('Authorization token required', 401))
    }
    const token = authorization.split(" ")[1];
    if (!token) {
        return next(new Error('You must be logged in', 404))
    }
    const { id, email } = jwt.verify(token, process.env.SECRET_KEY);
    if (!id || !email) {
        return next(new Error('Invalid token', 403))
    }
    req.user = {id, email};
    next();
}


const isAdmin = async (req, res, next) => {
    const { email } = req.user;
    try {
        if (email) {
            const query = `SELECT * FROM users WHERE email = $1`;
                const user = await pool.query(query, [email]);
                if (!user) {
                    throw new Error('Invalid user', 400)
                }
                if (!user.rows[0].isAdmin) {
                throw new Error('Not authorized to perform this operation', 403)
                }
            return next()
        }
        throw new Error('You must be logged in', 403)
    } catch (error) {
        next(error)
    }
}
module.exports = {createToken, verifyToken, isAdmin}