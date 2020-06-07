const express = require('express');
const router = express.Router();
const { signup, login, logout, requireLoggedin, forgetPassword, resetPassword, preSignup } = require('../controllers/auth');
// validator
const { runValidation } = require('../validators/index')
const { userSignupValidator, userLoginValidator, forgetPasswordValidator, resetPasswordValidator } = require('../validators/auth')



router.post('/pre-signup', userSignupValidator, runValidation, preSignup)
router.post('/signup', signup)
router.post('/login', userLoginValidator, runValidation, login)
router.get('/logout', logout)
router.put('/forget-password', forgetPasswordValidator, runValidation, forgetPassword)
router.put('/reset-password', resetPasswordValidator, runValidation, resetPassword)
module.exports = router;