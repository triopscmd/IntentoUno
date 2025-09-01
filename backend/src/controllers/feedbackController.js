const db = require('../models');
const ExamResult = db.ExamResult;
const Exam = db.Exam;
const Question = db.Question;
const Answer = db.Answer;
const Subject = db.Subject;
const Grade = db.Grade;
const feedbackService = require('../services/feedbackService');

exports.getExamFeedback = async (req, res) => {
    try {
        const { resultId } = req.params;
        const userId = req.user ? req.user.id : null;

        const examResult = await ExamResult.findByPk(resultId, {
            include: [
                {
                    model: Exam,
                    as: 'Exam',
                    include: [
                        { model: Subject, as: 'Subject' },
                        { model: Grade, as: 'Grade' },
                        {
                            model: Question,
                            as: 'Questions',
                            through: { attributes: [] },
                            include: [{ model: Answer, as: 'Answers' }]
                        }
                    ]
                },
                { model: db.User, as: 'User', attributes: ['username'] }
            ]
        });

        if (!examResult) {
            return res.status(404).json({ message: 'Exam result not found.' });
        }

        if (examResult.userId !== userId) {
            return res.status(403).json({ message: 'Access denied to this exam result.' });
        }

        const allQuestionsWithAnswers = examResult.Exam.Questions.map(q => ({
            questionId: q.id,
            text: q.text,
            Answers: q.Answers.map(a => ({ id: a.id, text: a.text, isCorrect: a.isCorrect }))
        }));

        // Re-calculate score and get detailed results (it's stored in ExamResult.userAnswers, but re-calculating ensures consistency and provides detailed per-question feedback structure)
        const { detailedFeedback } = await require('../services/scoreCalculator').calculateScore(
            examResult.examId,
            examResult.userAnswers
        );

        const finalDetailedFeedback = feedbackService.generateDetailedQuestionFeedback(
            detailedFeedback,
            allQuestionsWithAnswers.flatMap(q => q.Answers) // Pass all answers from all questions
        );

        res.render('examResult', {
            examResult,
            exam: examResult.Exam,
            user: examResult.User,
            subjectName: examResult.Exam.Subject.name,
            gradeLevel: examResult.Exam.Grade.level,
            detailedFeedback: finalDetailedFeedback
        });

    } catch (error) {
        console.error('Error fetching exam feedback:', error);
        res.status(500).json({ message: 'Error retrieving exam feedback' });
    }
};
