const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ExamQuestion = sequelize.define('ExamQuestion', {
    examId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: 'exam_id'
    },
    questionId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: 'question_id'
    },
    questionOrder: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'question_order'
    }
}, {
    tableName: 'exam_questions',
    timestamps: false
});

module.exports = ExamQuestion;
