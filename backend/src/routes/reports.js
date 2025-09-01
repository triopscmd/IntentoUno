const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const feedbackController = require('../controllers/feedbackController');
const { verifyToken } = require('../middleware/authMiddleware');

// Route to get a user's overall performance report
router.get('/user/:userId', verifyToken, reportController.getPerformanceReport);

// Route to get detailed feedback for a specific exam result
router.get('/:resultId', verifyToken, feedbackController.getExamFeedback);

module.exports = router;
