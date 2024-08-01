const express = require('express');
const { register, login, userProfile, editProfile } = require('./userController');
const { verifyToken } = require('../../middlewares');
const router = express.Router();

router.post('/register', register)
router.post('/login', login)
router.route('/profile')
    .get(verifyToken, userProfile)
    .put(verifyToken, editProfile)

module.exports = router;