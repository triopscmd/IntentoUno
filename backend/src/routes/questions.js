const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

// Question routes (Admin only for creation/update/deletion, students can view if needed for review, but typically only via exams)
router.post('/', verifyToken, authorizeRoles(['admin']), questionController.createQuestion);
router.get('/', verifyToken, authorizeRoles(['admin']), questionController.getQuestions); // Admin can browse question bank
router.get('/:id', verifyToken, authorizeRoles(['admin']), questionController.getQuestionById);
router.put('/:id', verifyToken, authorizeRoles(['admin']), questionController.updateQuestion);
router.delete('/:id', verifyToken, authorizeRoles(['admin']), questionController.deleteQuestion);

module.exports = router;
