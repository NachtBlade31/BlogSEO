const express = require('express');
const router = express.Router();
const { authMiddleWare, requireLoggedin, adminMiddleWare } = require('../controllers/auth');
const { read, publicProfile, update, photo } = require('../controllers/user');


router.get('/user/profile', requireLoggedin, authMiddleWare, read)
router.get('/user/:username', publicProfile)
router.put('/user/update', requireLoggedin, authMiddleWare, update)
router.get('/user/photo/:username', photo)
module.exports = router;