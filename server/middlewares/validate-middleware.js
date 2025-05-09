const validate = (schema) => async (req, res, next) => {
    try {
        const parseBody = await schema.validateAsync(req.body);
        req.body = parseBody;
        next();
    } catch (error) {
        const message = error.details[0].message;
        
        // Handle form submissions by rendering appropriate view with error
        if (req.path === '/register') {
            return res.render('register', { 
                error: message,
                formData: req.body 
            });
        } else if (req.path === '/login') {
            return res.render('login', { 
                error: message,
                formData: req.body 
            });
        } else if (req.path === '/verify-otp') {
            return res.render('verify-otp', { 
                error: message,
                email: req.body.email 
            });
        }
        
        // Default JSON response for API requests
        res.status(400).json({ message });
    }
};

module.exports = validate;