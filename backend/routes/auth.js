const express = require('express');
const router = express.Router();
const { signup, login, logout, requireLoggedin } = require('../controllers/auth');
// validator
const { runValidation } = require('../validators/index')
const { userSignupValidator, userLoginValidator, forgePasswordValidator, resetPasswordValidator, forgetPassword, resetPassword } = require('../validators/auth')




router.post('/signup', userSignupValidator, runValidation, signup)
router.post('/login', userLoginValidator, runValidation, login)
router.get('/logout', logout)
router.put('/forget-password', forgePasswordValidator, runValidation, forgetPassword)
router.put('/reset-password', resetPasswordValidator, runValidation, resetPassword)
module.exports = router;