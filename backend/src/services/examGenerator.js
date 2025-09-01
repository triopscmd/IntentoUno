const db = require('../models');
const Question = db.Question;
const Answer = db.Answer;
const Exam = db.Exam;
const ExamQuestion = db.ExamQuestion;

/**
 * Generates a new exam based on specified subject and grade.
 * @param {number} subjectId
 * @param {number} gradeId
 * @param {number} numberOfQuestions
 * @param {number} [userId=null] - Optional user ID if the exam is generated for a specific user.
 * @returns {Promise<Object>} The newly created exam object with its questions.
 */
exports.generateExam = async (subjectId, gradeId, numberOfQuestions, userId = null) => {
    const transaction = await db.sequelize.transaction();
    try {
        const availableQuestions = await Question.findAll({
            where: { subjectId, gradeId },
            include: [{ model: Answer, as: 'Answers' }],
            transaction
        });

        if (availableQuestions.length < numberOfQuestions) {
            throw new Error(`Not enough questions available for subject ${subjectId} and grade ${gradeId}. Available: ${availableQuestions.length}, Requested: ${numberOfQuestions}`);
        }

        // Shuffle questions and pick the desired number
        const shuffledQuestions = availableQuestions.sort(() => 0.5 - Math.random());
        const selectedQuestions = shuffledQuestions.slice(0, numberOfQuestions);

        const newExam = await Exam.create({
            userId,
            subjectId,
            gradeId,
            status: 'pending'
        }, { transaction });

        const examQuestionsData = selectedQuestions.map((q, index) => ({
            examId: newExam.id,
            questionId: q.id,
            questionOrder: index + 1
        }));

        await ExamQuestion.bulkCreate(examQuestionsData, { transaction });

        await transaction.commit();

        // Fetch the generated exam with questions for response
        const examWithQuestions = await Exam.findByPk(newExam.id, {
            include: [
                {
                    model: Question,
                    as: 'Questions',
                    through: { attributes: ['questionOrder'] },
                    include: [{ model: Answer, as: 'Answers', attributes: ['id', 'text'] }]
                },
                { model: db.Subject, as: 'Subject', attributes: ['name'] },
                { model: db.Grade, as: 'Grade', attributes: ['level'] }
            ],
            order: [[{ model: Question, as: 'Questions' }, ExamQuestion, 'questionOrder', 'ASC']]
        });

        // Remove correct answers from the questions before sending to user
        const sanitizedQuestions = examWithQuestions.Questions.map(question => {
            const { Answers, ...rest } = question.toJSON();
            const sanitizedAnswers = Answers.map(answer => ({ id: answer.id, text: answer.text }));
            return { ...rest, Answers: sanitizedAnswers };
        });

        return { ...examWithQuestions.toJSON(), Questions: sanitizedQuestions };

    } catch (error) {
        await transaction.rollback();
        console.error('Error generating exam:', error);
        throw error;
    }
};
