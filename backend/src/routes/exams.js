const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

// API route to generate a new exam (admin or student)
router.post('/generate', verifyToken, examController.generateNewExam);

// Route to render the exam taking page (for students)
router.get('/:examId/take', verifyToken, examController.getExamForTaking);

// API route to submit exam answers
router.post('/:examId/submit', verifyToken, examController.submitExam);

module.exports = router;
