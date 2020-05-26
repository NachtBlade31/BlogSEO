const express = require('express');
const router = express.Router();
const { authMiddleWare, requireLoggedin, adminMiddleWare } = require('../controllers/auth');
const { read, publicProfile } = require('../controllers/user');


router.get('/profile', requireLoggedin, authMiddleWare, read)
router.get('/user/:username', publicProfile)

module.exports = router;