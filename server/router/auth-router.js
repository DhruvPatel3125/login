const express = require('express');
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

module.exports = router;