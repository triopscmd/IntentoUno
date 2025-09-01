const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.User;

// Secret for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Contains { id, username, email, role }
        next();
    } catch (err) {
        res.status(403).json({ message: 'Token is not valid' });
    }
};

const authorizeRoles = (roles) => (req, res, next) => {
    if (!req.user || !req.user.role) {
        return res.status(401).json({ message: 'User role not found, authorization denied' });
    }
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: `Access denied, required role(s): ${roles.join(', ')}` });
    }
    next();
};

module.exports = {
    verifyToken,
    authorizeRoles
};
