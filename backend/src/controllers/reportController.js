const db = require('../models');
const ExamResult = db.ExamResult;
const Exam = db.Exam;
const User = db.User;
const Subject = db.Subject;
const Grade = db.Grade;

exports.getPerformanceReport = async (req, res) => {
    try {
        const { userId } = req.params; // Get user ID from URL for specific user reports
        const requestingUserId = req.user ? req.user.id : null;

        if (!requestingUserId) {
            return res.status(401).json({ message: 'Authentication required to view reports.' });
        }

        // Allow users to see their own reports, and admins to see any user's reports
        const user = await User.findByPk(requestingUserId);
        if (!user || (user.id != userId && user.role !== 'admin')) {
            return res.status(403).json({ message: 'Access denied to view this report.' });
        }

        const reports = await ExamResult.findAll({
            where: { userId: userId },
            include: [
                {
                    model: Exam,
                    as: 'Exam',
                    include: [
                        { model: Subject, as: 'Subject', attributes: ['name'] },
                        { model: Grade, as: 'Grade', attributes: ['level'] }
                    ]
                }
            ],
            order: [['submissionDate', 'DESC']]
        });

        const userReported = await User.findByPk(userId, { attributes: ['username'] });
        if (!userReported) {
            return res.status(404).json({ message: 'User not found for reports.' });
        }

        res.render('performanceReport', {
            reports,
            userName: userReported.username,
            currentUserId: requestingUserId,
            targetUserId: userId
        });

    } catch (error) {
        console.error('Error fetching performance report:', error);
        res.status(500).json({ message: 'Error retrieving performance report' });
    }
};
