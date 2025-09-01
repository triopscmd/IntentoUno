const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/subjectController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

// Subject routes (Admin only for creation/update/deletion)
router.post('/', verifyToken, authorizeRoles(['admin']), subjectController.createSubject);
router.get('/', subjectController.getSubjects); // Anyone can view subjects
router.get('/:id', subjectController.getSubjectById);
router.put('/:id', verifyToken, authorizeRoles(['admin']), subjectController.updateSubject);
router.delete('/:id', verifyToken, authorizeRoles(['admin']), subjectController.deleteSubject);

// Grade routes (Admin only for creation/update/deletion)
router.post('/grades', verifyToken, authorizeRoles(['admin']), subjectController.createGrade);
router.get('/grades', subjectController.getGrades); // Anyone can view grades
router.get('/grades/:id', subjectController.getGradeById);
router.put('/grades/:id', verifyToken, authorizeRoles(['admin']), subjectController.updateGrade);
router.delete('/grades/:id', verifyToken, authorizeRoles(['admin']), subjectController.deleteGrade);

module.exports = router;
