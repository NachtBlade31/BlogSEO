const { check } = require('express-validator');

exports.userSignupValidator = [
    check('name').not().isEmpty().withMessage("Name is Required"),
    check('email').isEmail().withMessage("Must be a valid Email Address"),
    check('password').isLength({ min: 10 }).withMessage("Password must be at least 10 characters long")
];

exports.userLoginValidator = [
    check('email').isEmail().withMessage("Must be a valid Email Address"),
    check('password').isLength({ min: 10 }).withMessage("Password must be at least 10 characters long")
];

exports.forgePasswordValidator = [
    check('email').not().isEmpty().isEmail().withMessage("Must be a valid Email Address")
];

exports.resetPasswordValidator = [
    check('newPassword').not().isEmpty().isLength({ min: 10 }).withMessage("Password must be at least 10 characters long")
];