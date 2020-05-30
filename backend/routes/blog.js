const express = require('express');
const router = express.Router();
const { create, list, listAllBlogsCategoriesTags, remove, update, read, photo, listRelated, listSearch, listByUser } = require('../controllers/blog');
const { requireLoggedin, adminMiddleWare, authMiddleWare, canUpdateDelete } = require('../controllers/auth');
router.post('/blog', requireLoggedin, adminMiddleWare, create)
router.get('/blogs', list)
router.post('/blogs-categories-tags', listAllBlogsCategoriesTags)
router.get('/blog/:slug', read)
router.delete('/blog/:slug', remove, requireLoggedin, adminMiddleWare)
router.put('/blog/:slug', update, requireLoggedin, adminMiddleWare)
router.get('/blog/photo/:slug', photo)
router.post('/blogs/related', listRelated)
router.get('/blogs/search', listSearch)

//auth user blog crud
router.post('/user/blog', requireLoggedin, authMiddleWare, create)
router.get('/:username/blogs', listByUser)
router.delete('/user/blog/:slug', remove, canUpdateDelete, requireLoggedin, authMiddleWare)
router.put('/user/blog/:slug', update, canUpdateDelete, requireLoggedin, authMiddleWare)
module.exports = router;