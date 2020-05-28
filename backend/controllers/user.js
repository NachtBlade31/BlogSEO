const User = require('../models/User');
const Blog = require('../models/Blog')
const _ = require('lodash')
const formidable = require('formidable');
const fs = require('fs')
const bcrypt = require('bcryptjs');
const { errorHandler } = require('../helpers/dbErrorHandler')
exports.read = (req, res) => {
    req.profile.password = undefined;
    return res.json(req.profile);
}

exports.publicProfile = (req, res) => {
    let username = req.params.username
    let user
    let blogs
    User.findOne({ username }).exec((err, userFromDB) => {
        if (err || !userFromDB) {
            return res.status(400).json({
                error: "User not found"
            })
        }
        user = userFromDB
        let userId = user._id
        Blog.find({ postedBy: userId })
            .populate('categories', '_id name slug')
            .populate('tags', '_id name slug')
            .populate('postedBy', '_id name')
            .limit(10)
            .select('_id title slug excerpt categories tags postedBy createdAt updatedAt')
            .exec((err, data) => {
                if (err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    })
                }
                user.photo = undefined
                user.password = undefined
                res.json({
                    user, blogs: data
                })
            })
    })
}

exports.update = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true;
    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Photo could not be uploaded"
            })
        }

        let user = req.profile

        user = _.extend(user, fields)
        if (fields.password && fields.password.length < 10) {
            return res.status(400).json({
                error: 'password should be atleast 10 character long'
            })
        }
        // const salt = await bcrypt.genSalt(10);
        // user.password = await bcrypt.hash(fields.password, salt);

        if (files.photo) {
            if (files.photo.size > 10000000) {
                return res.status(400).json({
                    error: "Image should be less then 1mb"
                })
            }
            user.photo.data = fs.readFileSync(files.photo.path)
            user.photo.contentType = files.photo.type

        }
        user.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            user.password = undefined
            user.photo = undefined
            res.json(user)
        })
    })
}

exports.photo = (req, res) => {
    const username = req.params.username
    User.findOne({ username }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "User not found"
            })
        }
        if (user.photo.data) {
            res.set('Content-Type', user.photo.contentType)
            return res.send(user.photo.data)
        }
    })
}