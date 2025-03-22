const express = require('express');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Auth routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Development route for creating admin
if (process.env.NODE_ENV === 'development') {
  router.post('/create-admin', authController.createAdmin);
}

module.exports = router; 