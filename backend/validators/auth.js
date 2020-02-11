const { check } = require('express-validator');

exports.userSignupValidator = [
    check('name').not().isEmpty().withMessage("Name is Required"),
    check('email').isEmail().withMessage("Must be a valid Email Address"),
    check('password').isLength({ min: 10 }).withMessage("Password must be at least 10 characters long")
];