const express = require('express');
const router = express.Router();
const { authMiddleWare, requireLoggedin, adminMiddleWare } = require('../controllers/auth');
const { read } = require('../controllers/user');


router.get('/profile', requireLoggedin, authMiddleWare, read)


module.exports = router;