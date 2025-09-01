const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ExamResult = sequelize.define('ExamResult', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id'
    },
    examId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'exam_id'
    },
    score: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false
    },
    totalQuestions: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'total_questions'
    },
    correctQuestions: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'correct_questions'
    },
    submissionDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'submission_date'
    },
    userAnswers: {
        type: DataTypes.JSONB, // Stores an array of objects: [{questionId: 1, selectedAnswerIds: [2, 3]}, ...]
        allowNull: true // Can be null if exam is not completed yet
    },
    feedback: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'exam_results',
    timestamps: false
});

module.exports = ExamResult;
