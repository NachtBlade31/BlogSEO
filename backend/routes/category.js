const express = require('express');
const router = express.Router();
const { create, list, read, remove } = require('../controllers/category');

const { runValidation } = require('../validators/index')
const { categoryCreateValidator } = require('../validators/category')
const { requireLoggedin, adminMiddleWare } = require('../controllers/auth');

router.post('/category', categoryCreateValidator, runValidation, requireLoggedin, adminMiddleWare, create)
router.get('/categories', list)
router.get('/category/:slug', read)
router.delete('/category/:slug', requireLoggedin, adminMiddleWare, remove)

module.exports = router;