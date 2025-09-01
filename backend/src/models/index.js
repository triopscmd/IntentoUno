const sequelize = require('../config/database');
const User = require('./User');
const Subject = require('./Subject');
const Grade = require('./Grade');
const Question = require('./Question');
const Answer = require('./Answer');
const Exam = require('./Exam');
const ExamQuestion = require('./ExamQuestion');
const ExamResult = require('./ExamResult');

// Define Associations

// User Associations
User.hasMany(Exam, { foreignKey: 'userId', as: 'Exams' });
User.hasMany(ExamResult, { foreignKey: 'userId', as: 'ExamResults' });

// Subject Associations
Subject.hasMany(Question, { foreignKey: 'subjectId', as: 'Questions' });
Subject.hasMany(Exam, { foreignKey: 'subjectId', as: 'Exams' });

// Grade Associations
Grade.hasMany(Question, { foreignKey: 'gradeId', as: 'Questions' });
Grade.hasMany(Exam, { foreignKey: 'gradeId', as: 'Exams' });

// Question Associations
Question.belongsTo(Subject, { foreignKey: 'subjectId', as: 'Subject' });
Question.belongsTo(Grade, { foreignKey: 'gradeId', as: 'Grade' });
Question.hasMany(Answer, { foreignKey: 'questionId', as: 'Answers', onDelete: 'CASCADE' });

// Answer Associations
Answer.belongsTo(Question, { foreignKey: 'questionId', as: 'Question' });

// Exam Associations
Exam.belongsTo(User, { foreignKey: 'userId', as: 'User' });
Exam.belongsTo(Subject, { foreignKey: 'subjectId', as: 'Subject' });
Exam.belongsTo(Grade, { foreignKey: 'gradeId', as: 'Grade' });
Exam.belongsToMany(Question, { through: ExamQuestion, foreignKey: 'examId', otherKey: 'questionId', as: 'Questions' });
Exam.hasOne(ExamResult, { foreignKey: 'examId', as: 'Result' });

// ExamQuestion (Join table) Associations - Defined implicitly by belongsToMany
ExamQuestion.belongsTo(Exam, { foreignKey: 'examId' });
ExamQuestion.belongsTo(Question, { foreignKey: 'questionId' });

// ExamResult Associations
ExamResult.belongsTo(User, { foreignKey: 'userId', as: 'User' });
ExamResult.belongsTo(Exam, { foreignKey: 'examId', as: 'Exam' });

const db = {
    sequelize,
    User,
    Subject,
    Grade,
    Question,
    Answer,
    Exam,
    ExamQuestion,
    ExamResult
};

module.exports = db;
