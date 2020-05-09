const express = require('express');
const router = express.Router();
const { signup, login, logout, requireLoggedin } = require('../controllers/auth');
// validator
const { runValidation } = require('../validators/index')
const { userSignupValidator, userLoginValidator } = require('../validators/auth')




router.post('/signup', userSignupValidator, runValidation, signup)
router.post('/login', userLoginValidator, runValidation, login)
router.get('/logout', logout)

//test
// router.get('/secret', requireLoggedin, (req, res) => {
//     res.json({
//         user: req.user
//     });
// });

module.exports = router;