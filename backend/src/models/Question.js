const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Question = sequelize.define('Question', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    subjectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'subject_id'
    },
    gradeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'grade_id'
    },
    type: {
        type: DataTypes.STRING,
        defaultValue: 'single-choice' // 'single-choice' or 'multiple-choice'
    }
}, {
    tableName: 'questions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Question;
