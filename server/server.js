require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const app = express();
const PORT = process.env.PORT || 5000;
const router = require('./router/auth-router');
const connectDb = require('./utils/db');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // set to true if using https
}));

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from public directory
app.use(express.static('public'));

// Authentication middleware
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
};

// Routes
app.use("/", router);
app.get('/home', isAuthenticated, (req, res) => {
    res.render('home', { user: req.session.user });
});

const startServer = async () => {
    try {
        await connectDb();
        
        
        app.listen(PORT, () => {
            console.log(`Server is running on: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error starting server:', error.message);
        process.exit(1);
    }
};

startServer();
