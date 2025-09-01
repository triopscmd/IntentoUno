const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);

// Example of a protected route
router.get('/profile', verifyToken, (req, res) => {
    res.status(200).json({ message: 'Welcome to your profile!', user: req.user });
});

module.exports = router;
