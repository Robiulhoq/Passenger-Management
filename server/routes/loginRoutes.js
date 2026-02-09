const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');

// Login user
router.post('/login', loginController.loginUser);

// Get all login records (for testing)
router.get('/logins', loginController.getAllLogins);

// Create a new login record
router.post('/register', loginController.createLogin);

module.exports = router;
