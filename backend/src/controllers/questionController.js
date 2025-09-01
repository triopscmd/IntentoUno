const db = require('../models');
const Question = db.Question;
const Answer = db.Answer;
const Subject = db.Subject;
const Grade = db.Grade;

exports.createQuestion = async (req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
        const { text, subjectId, gradeId, type, answers } = req.body;

        if (!answers || answers.length !== 5) {
            await transaction.rollback();
            return res.status(400).json({ message: 'A question must have exactly 5 answer options.' });
        }

        const correctAnswers = answers.filter(a => a.isCorrect);
        if (correctAnswers.length === 0) {
            await transaction.rollback();
            return res.status(400).json({ message: 'At least one answer must be marked as correct.' });
        }
        
        const subjectExists = await Subject.findByPk(subjectId, { transaction });
        if (!subjectExists) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Subject not found.' });
        }

        const gradeExists = await Grade.findByPk(gradeId, { transaction });
        if (!gradeExists) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Grade not found.' });
        }

        const question = await Question.create({
            text,
            subjectId,
            gradeId,
            type: type || 'single-choice'
        }, { transaction });

        const answerPromises = answers.map(answer =>
            Answer.create({
                questionId: question.id,
                text: answer.text,
                isCorrect: answer.isCorrect
            }, { transaction })
        );

        await Promise.all(answerPromises);
        await transaction.commit();

        res.status(201).json({ message: 'Question created successfully', questionId: question.id });

    } catch (error) {
        await transaction.rollback();
        console.error('Error creating question:', error);
        res.status(500).json({ message: 'Error creating question', error: error.message });
    }
};

exports.getQuestions = async (req, res) => {
    try {
        const { subjectId, gradeId } = req.query;
        const whereClause = {};
        if (subjectId) whereClause.subjectId = subjectId;
        if (gradeId) whereClause.gradeId = gradeId;

        const questions = await Question.findAll({
            where: whereClause,
            include: [
                { model: Answer, as: 'Answers' },
                { model: Subject, as: 'Subject', attributes: ['name'] },
                { model: Grade, as: 'Grade', attributes: ['level'] }
            ],
            order: [['id', 'ASC']]
        });
        res.status(200).json(questions);
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ message: 'Error fetching questions' });
    }
};

exports.getQuestionById = async (req, res) => {
    try {
        const { id } = req.params;
        const question = await Question.findByPk(id, {
            include: [
                { model: Answer, as: 'Answers' },
                { model: Subject, as: 'Subject', attributes: ['name'] },
                { model: Grade, as: 'Grade', attributes: ['level'] }
            ]
        });
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }
        res.status(200).json(question);
    } catch (error) {
        console.error('Error fetching question by ID:', error);
        res.status(500).json({ message: 'Error fetching question' });
    }
};

exports.updateQuestion = async (req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
        const { id } = req.params;
        const { text, subjectId, gradeId, type, answers } = req.body;

        const question = await Question.findByPk(id, { transaction });
        if (!question) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Question not found' });
        }

        if (answers && answers.length !== 5) {
            await transaction.rollback();
            return res.status(400).json({ message: 'A question must have exactly 5 answer options.' });
        }

        if (answers) {
            const correctAnswers = answers.filter(a => a.isCorrect);
            if (correctAnswers.length === 0) {
                await transaction.rollback();
                return res.status(400).json({ message: 'At least one answer must be marked as correct.' });
            }
        }

        await question.update({ text, subjectId, gradeId, type }, { transaction });

        if (answers) {
            // Delete existing answers and create new ones
            await Answer.destroy({ where: { questionId: question.id }, transaction });
            const answerPromises = answers.map(answer =>
                Answer.create({
                    questionId: question.id,
                    text: answer.text,
                    isCorrect: answer.isCorrect
                }, { transaction })
            );
            await Promise.all(answerPromises);
        }

        await transaction.commit();
        res.status(200).json({ message: 'Question updated successfully' });

    } catch (error) {
        await transaction.rollback();
        console.error('Error updating question:', error);
        res.status(500).json({ message: 'Error updating question', error: error.message });
    }
};

exports.deleteQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRows = await Question.destroy({ where: { id } });
        if (deletedRows === 0) {
            return res.status(404).json({ message: 'Question not found' });
        }
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting question:', error);
        res.status(500).json({ message: 'Error deleting question' });
    }
};
