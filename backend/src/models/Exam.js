const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Exam = sequelize.define('Exam', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true, // An admin might generate an exam not tied to a user immediately
        field: 'user_id'
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
    generatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'generated_at'
    },
    completedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'completed_at'
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'pending' // 'pending', 'completed'
    }
}, {
    tableName: 'exams',
    timestamps: false // Handled by generated_at, completed_at, etc. if needed.
});

module.exports = Exam;
