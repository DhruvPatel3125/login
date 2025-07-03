const express = require('express');
const passport = require('../utils/passport');
const router = express.Router();
const authcontrollers = require('../controllers/auth-controller');
const validate = require('../middlewares/validate-middleware');
const { signupSchema, loginSchema, otpSchema } = require('../validators/auth-validator');

// View routes
router.get('/', authcontrollers.home);
router.get('/register', authcontrollers.registerForm);
router.get('/logout', authcontrollers.logout);

// API routes with validation
router.post('/register', validate(signupSchema), authcontrollers.register);
router.post('/login', validate(loginSchema), authcontrollers.login);
router.post('/verify-otp', validate(otpSchema), authcontrollers.verifyOTP);
router.get('/resend-otp', authcontrollers.resendOTP);

// Google
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'], prompt: 'select_account' }));
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  // Set session user
  req.session.user = {
    id: req.user._id,
    username: req.user.username,
    email: req.user.email,
    phone: req.user.phone,
    createdAt: req.user.createdAt,
  };
  res.redirect('/home');
});

module.exports = router;