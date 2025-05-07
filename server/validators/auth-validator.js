const Joi = require('joi');

const signupSchema = Joi.object({
    username: Joi.string().min(3).max(30).required()
        .messages({
            'string.empty': 'Username is required',
            'string.min': 'Username should be at least 3 characters',
            'string.max': 'Username should not exceed 30 characters'
        }),
    email: Joi.string().email().required()
        .messages({
            'string.empty': 'Email is required',
            'string.email': 'Please enter a valid email'
        }),
    phone: Joi.string().pattern(/^[0-9]{10}$/).required()
        .messages({
            'string.empty': 'Phone number is required',
            'string.pattern.base': 'Please enter a valid 10-digit phone number'
        }),
    password: Joi.string().min(6).required()
        .messages({
            'string.empty': 'Password is required',
            'string.min': 'Password should be at least 6 characters'
        })
});

const loginSchema = Joi.object({
    email: Joi.string().email().required()
        .messages({
            'string.empty': 'Email is required',
            'string.email': 'Please enter a valid email'
        }),
    password: Joi.string().required()
        .messages({
            'string.empty': 'Password is required'
        })
});

module.exports = { signupSchema, loginSchema };