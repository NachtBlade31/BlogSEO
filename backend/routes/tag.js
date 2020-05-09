const express = require('express');
const router = express.Router();
const { create, list, read, remove } = require('../controllers/tag');

const { runValidation } = require('../validators/index')
const { tagCreateValidator } = require('../validators/tag')
const { requireLoggedin, adminMiddleWare } = require('../controllers/auth');

router.post('/tag', tagCreateValidator, runValidation, requireLoggedin, adminMiddleWare, create)
router.get('/tags', list)
router.get('/tag/:slug', read)
router.delete('/tag/:slug', requireLoggedin, adminMiddleWare, remove)

module.exports = router;