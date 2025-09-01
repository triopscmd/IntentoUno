const db = require('../models');
const Question = db.Question;
const Answer = db.Answer;
const Exam = db.Exam;
const ExamQuestion = db.ExamQuestion;

/**
 * Calculates the score for a submitted exam.
 * @param {number} examId - The ID of the exam.
 * @param {Array<Object>} userAnswers - An array of user's answers: [{ questionId: 1, selectedAnswerIds: [2, 3] }, ...]
 * @param {Object} transaction - Sequelize transaction object.
 * @returns {Promise<Object>} An object containing score, correctQuestionsCount, totalQuestions, and detailed feedback.
 */
exports.calculateScore = async (examId, userAnswers, transaction) => {
    const exam = await Exam.findByPk(examId, {
        include: [
            {
                model: Question,
                as: 'Questions',
                through: { attributes: [] }, // We only need the questions, not the join table attributes here
                include: [{ model: Answer, as: 'Answers', attributes: ['id', 'isCorrect'] }]
            }
        ],
        transaction
    });

    if (!exam) {
        throw new Error('Exam not found for scoring.');
    }

    let correctQuestionsCount = 0;
    const totalQuestions = exam.Questions.length;
    const detailedFeedback = [];

    for (const examQuestion of exam.Questions) {
        const questionId = examQuestion.id;
        const correctAnswers = examQuestion.Answers.filter(a => a.isCorrect).map(a => a.id).sort();
        const userAnswerEntry = userAnswers.find(ua => ua.questionId === questionId);
        const selectedAnswerIds = userAnswerEntry ? userAnswerEntry.selectedAnswerIds.sort() : [];

        let isQuestionCorrect = false;

        if (correctAnswers.length === selectedAnswerIds.length &&
            correctAnswers.every((val, index) => val === selectedAnswerIds[index])) {
            isQuestionCorrect = true;
            correctQuestionsCount++;
        }

        detailedFeedback.push({
            questionId: questionId,
            questionText: examQuestion.text,
            isCorrect: isQuestionCorrect,
            correctAnswerIds: correctAnswers,
            userSelectedAnswerIds: selectedAnswerIds
        });
    }

    const score = (correctQuestionsCount / totalQuestions) * 100;

    return {
        score: parseFloat(score.toFixed(2)),
        correctQuestionsCount,
        totalQuestions,
        detailedFeedback
    };
};
