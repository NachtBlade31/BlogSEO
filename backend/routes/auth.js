const express = require('express');
const router = express.Router();
const { signup,login } = require('../controllers/auth');
// validator
const { runValidation } = require('../validators/index')
const { userSignupValidator ,userLoginValidator} = require('../validators/auth')




router.post('/signup', userSignupValidator, runValidation, signup)
router.post('/login', userLoginValidator, runValidation, login)


module.exports = router;