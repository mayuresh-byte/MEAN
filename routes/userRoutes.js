const express = require('express');
const { registerUser, loginUser, currentUser } = require('../controllers/userController');
const ValidateToken = require('../middleware/validateTokenhandler');
const router = express.Router();

router.route('/register').post(registerUser);

router.route('/login').post(loginUser);

router.get('/current', ValidateToken, currentUser);

module.exports = router;