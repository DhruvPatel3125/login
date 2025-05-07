const validate = (schema) => async (req, res, next) => {
    try {
        const parseBody = await schema.validateAsync(req.body);
        req.body = parseBody;
        next();
    } catch (error) {
        const message = error.details[0].message;
        res.status(400).json({ message });
    }
};

module.exports = validate;