const examGenerator = require('../services/examGenerator');
const db = require('../models');
const Exam = db.Exam;
const Question = db.Question;
const Answer = db.Answer;
const ExamResult = db.ExamResult;
const Subject = db.Subject;
const Grade = db.Grade;
const scoreCalculator = require('../services/scoreCalculator');
const feedbackService = require('../services/feedbackService');

exports.generateNewExam = async (req, res) => {
    try {
        const { subjectId, gradeId, numberOfQuestions = 10 } = req.body;
        const userId = req.user ? req.user.id : null; // Link exam to user if authenticated

        if (!subjectId || !gradeId) {
            return res.status(400).json({ message: 'Subject ID and Grade ID are required to generate an exam.' });
        }

        const exam = await examGenerator.generateExam(subjectId, gradeId, numberOfQuestions, userId);
        
        // Redirect or render exam taking page with exam ID
        // For API, just return the exam details
        res.status(201).json({ message: 'Exam generated successfully', examId: exam.id, exam });

    } catch (error) {
        console.error('Error generating new exam:', error);
        res.status(500).json({ message: error.message || 'Error generating exam' });
    }
};

exports.getExamForTaking = async (req, res) => {
    try {
        const { examId } = req.params;
        const userId = req.user ? req.user.id : null;

        const exam = await Exam.findByPk(examId, {
            include: [
                {
                    model: Question,
                    as: 'Questions',
                    through: { attributes: ['questionOrder'] },
                    include: [{ model: Answer, as: 'Answers', attributes: ['id', 'text'] }]
                },
                { model: Subject, as: 'Subject', attributes: ['name'] },
                { model: Grade, as: 'Grade', attributes: ['level'] }
            ],
            order: [[{ model: Question, as: 'Questions' }, 'ExamQuestion', 'questionOrder', 'ASC']]
        });

        if (!exam) {
            return res.status(404).json({ message: 'Exam not found.' });
        }

        // Ensure the exam belongs to the user if a user ID is present on the exam
        if (exam.userId && exam.userId !== userId) {
            return res.status(403).json({ message: 'Access denied to this exam.' });
        }

        if (exam.status === 'completed') {
            return res.status(400).json({ message: 'This exam has already been completed.' });
        }

        // Sanitize questions: remove isCorrect from answers for the user
        const sanitizedQuestions = exam.Questions.map(question => {
            const { Answers, ...rest } = question.toJSON();
            const sanitizedAnswers = Answers.map(answer => ({ id: answer.id, text: answer.text }));
            return { ...rest, Answers: sanitizedAnswers };
        });

        // Render EJS view for exam taking
        res.render('examTaking', {
            exam: { ...exam.toJSON(), Questions: sanitizedQuestions },
            subjectName: exam.Subject.name,
            gradeLevel: exam.Grade.level,
            userId: req.user ? req.user.id : null
        });

    } catch (error) {
        console.error('Error getting exam for taking:', error);
        res.status(500).json({ message: 'Error retrieving exam questions' });
    }
};

exports.submitExam = async (req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
        const { examId } = req.params;
        const { userAnswers } = req.body; // userAnswers: [{ questionId: 1, selectedAnswerIds: [2, 3] }, ...]
        const userId = req.user ? req.user.id : null;

        if (!userId) {
            await transaction.rollback();
            return res.status(401).json({ message: 'Authentication required to submit an exam.' });
        }

        const exam = await Exam.findByPk(examId, { transaction });
        if (!exam) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Exam not found.' });
        }

        if (exam.userId && exam.userId !== userId) {
            await transaction.rollback();
            return res.status(403).json({ message: 'Access denied to submit this exam.' });
        }

        if (exam.status === 'completed') {
            await transaction.rollback();
            return res.status(400).json({ message: 'This exam has already been completed.' });
        }

        // Calculate score
        const { score, correctQuestionsCount, totalQuestions, detailedFeedback } = await scoreCalculator.calculateScore(
            examId,
            userAnswers,
            transaction
        );

        // Generate feedback text
        const feedbackText = feedbackService.generateGeneralFeedback(score, totalQuestions);

        // Save exam result
        const examResult = await ExamResult.create({
            userId,
            examId,
            score,
            totalQuestions,
            correctQuestions: correctQuestionsCount,
            userAnswers,
            feedback: feedbackText
        }, { transaction });

        // Update exam status
        await exam.update({ status: 'completed', completedAt: new Date() }, { transaction });

        await transaction.commit();

        res.status(200).json({ message: 'Exam submitted successfully', resultId: examResult.id, score, totalQuestions, correctQuestions: correctQuestionsCount, feedback: detailedFeedback });

    } catch (error) {
        await transaction.rollback();
        console.error('Error submitting exam:', error);
        res.status(500).json({ message: error.message || 'Error submitting exam' });
    }
};
