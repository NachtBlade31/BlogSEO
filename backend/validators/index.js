const { validationResult } = require('express-validator');

exports.runValidation = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        // We are just sending one error message, first one instead of all
        return res.status(422).json({ error: errors.array()[0].msg });
    }
}

