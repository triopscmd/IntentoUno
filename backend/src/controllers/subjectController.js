const db = require('../models');
const Subject = db.Subject;
const Grade = db.Grade;

// --- Subject Management ---
exports.createSubject = async (req, res) => {
    try {
        const { name } = req.body;
        const subject = await Subject.create({ name });
        res.status(201).json(subject);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ message: 'Subject with this name already exists' });
        }
        console.error('Error creating subject:', error);
        res.status(500).json({ message: 'Error creating subject' });
    }
};

exports.getSubjects = async (req, res) => {
    try {
        const subjects = await Subject.findAll();
        res.status(200).json(subjects);
    } catch (error) {
        console.error('Error fetching subjects:', error);
        res.status(500).json({ message: 'Error fetching subjects' });
    }
};

exports.getSubjectById = async (req, res) => {
    try {
        const { id } = req.params;
        const subject = await Subject.findByPk(id);
        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        }
        res.status(200).json(subject);
    } catch (error) {
        console.error('Error fetching subject by ID:', error);
        res.status(500).json({ message: 'Error fetching subject' });
    }
};

exports.updateSubject = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const [updatedRows] = await Subject.update({ name }, { where: { id } });
        if (updatedRows === 0) {
            return res.status(404).json({ message: 'Subject not found' });
        }
        const updatedSubject = await Subject.findByPk(id);
        res.status(200).json(updatedSubject);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ message: 'Subject with this name already exists' });
        }
        console.error('Error updating subject:', error);
        res.status(500).json({ message: 'Error updating subject' });
    }
};

exports.deleteSubject = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRows = await Subject.destroy({ where: { id } });
        if (deletedRows === 0) {
            return res.status(404).json({ message: 'Subject not found' });
        }
        res.status(204).send(); // No Content
    } catch (error) {
        console.error('Error deleting subject:', error);
        res.status(500).json({ message: 'Error deleting subject' });
    }
};

// --- Grade Management ---
exports.createGrade = async (req, res) => {
    try {
        const { level } = req.body;
        const grade = await Grade.create({ level });
        res.status(201).json(grade);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ message: 'Grade with this level already exists' });
        }
        console.error('Error creating grade:', error);
        res.status(500).json({ message: 'Error creating grade' });
    }
};

exports.getGrades = async (req, res) => {
    try {
        const grades = await Grade.findAll();
        res.status(200).json(grades);
    } catch (error) {
        console.error('Error fetching grades:', error);
        res.status(500).json({ message: 'Error fetching grades' });
    }
};

exports.getGradeById = async (req, res) => {
    try {
        const { id } = req.params;
        const grade = await Grade.findByPk(id);
        if (!grade) {
            return res.status(404).json({ message: 'Grade not found' });
        }
        res.status(200).json(grade);
    } catch (error) {
        console.error('Error fetching grade by ID:', error);
        res.status(500).json({ message: 'Error fetching grade' });
    }
};

exports.updateGrade = async (req, res) => {
    try {
        const { id } = req.params;
        const { level } = req.body;
        const [updatedRows] = await Grade.update({ level }, { where: { id } });
        if (updatedRows === 0) {
            return res.status(404).json({ message: 'Grade not found' });
        }
        const updatedGrade = await Grade.findByPk(id);
        res.status(200).json(updatedGrade);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ message: 'Grade with this level already exists' });
        }
        console.error('Error updating grade:', error);
        res.status(500).json({ message: 'Error updating grade' });
    }
};

exports.deleteGrade = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRows = await Grade.destroy({ where: { id } });
        if (deletedRows === 0) {
            return res.status(404).json({ message: 'Grade not found' });
        }
        res.status(204).send(); // No Content
    } catch (error) {
        console.error('Error deleting grade:', error);
        res.status(500).json({ message: 'Error deleting grade' });
    }
};
