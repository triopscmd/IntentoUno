require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const db = require('./models');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true })); // Allow frontend to communicate
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(cookieParser()); // For parsing cookies

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route Imports
const authRoutes = require('./routes/auth');
const subjectRoutes = require('./routes/subjects');
const questionRoutes = require('./routes/questions');
const examRoutes = require('./routes/exams');
const reportRoutes = require('./routes/reports');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/questions', questionRoutes);

// Routes that involve both API and EJS rendering (or direct EJS rendering)
app.use('/exams', examRoutes); // GET /exams/:examId/take will render EJS
app.use('/reports', reportRoutes); // GET /reports/user/:userId and /reports/:resultId will render EJS

// Basic home route for EJS application (if needed)
app.get('/', (req, res) => {
    res.render('home', { title: 'Generador de Exámenes Primaria' });
});

// EJS home view (create a simple one)
app.get('/home', (req, res) => {
    res.render('home', { title: 'Generador de Exámenes Primaria' });
});

// Catch-all for undefined routes (API 404)
app.use((req, res, next) => {
    if (req.originalUrl.startsWith('/api')) {
        return res.status(404).json({ message: 'API Route Not Found' });
    }
    next(); // Pass to next middleware for other routes (e.g., frontend handler)
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Database connection and server start
db.sequelize.authenticate()
    .then(() => {
        console.log('Database connected!');
        // Sync models (creates tables if they don't exist, use { alter: true } for migrations in dev)
        return db.sequelize.sync(); // or sync({ force: true }) for development (drops and recreates tables)
    })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Unable to connect to the database or sync models:', err);
    });
