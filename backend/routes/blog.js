const express = require('express');
const router = express.Router();
const { create } = require('../controllers/blog');
const { requireLoggedin, adminMiddleWare } = require('../controllers/auth');
router.post('/blog', requireLoggedin, adminMiddleWare, create)


module.exports = router;