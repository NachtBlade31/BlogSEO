const express = require('express');
const router = express.Router();
const { create, list, listAllBlogsCategoriesTags, remove, update, read, photo } = require('../controllers/blog');
const { requireLoggedin, adminMiddleWare } = require('../controllers/auth');
router.post('/blog', requireLoggedin, adminMiddleWare, create)
router.get('/blogs', list)
router.post('/blogs-categories-tags', listAllBlogsCategoriesTags)
router.get('/blog/:slug', read)
router.delete('/blog/:slug', remove, requireLoggedin, adminMiddleWare)
router.put('/blog/:slug', update, requireLoggedin, adminMiddleWare)
router.get('/blog/photo/:slug', photo)
module.exports = router;