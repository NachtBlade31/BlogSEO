const Blog = require('../models/Blog');
const User = require('../models/User');
const formidable = require('formidable');
const slugify = require('slugify')
const stripHtml = require('string-strip-html')
const _ = require('lodash')
const Category = require('../models/Category')
const Tag = require('../models/Tag')
const { errorHandler } = require('../helpers/dbErrorHandler')
const fs = require('fs')
const { smartTrim } = require('../helpers/blog')

exports.create = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'image could not be uploaded'
            })
        }

        const { title, body, categories, tags } = fields
        if (!title || !title.length) {
            return res.status(400).json({
                error: 'Title is required'
            })
        }
        if (!body || body.length < 200) {
            return res.status(400).json({
                error: 'Content is too short'
            })
        }
        if (!categories || !categories.length === 0) {
            return res.status(400).json({
                error: 'Atleast one Category is required'
            })
        }
        if (!tags || !tags.length === 0) {
            return res.status(400).json({
                error: 'Atleast one Tag is required'
            })
        }
        let blog = new Blog()
        blog.title = title
        blog.body = body
        blog.excerpt = smartTrim(body, 320, ' ', ' ...')
        blog.slug = slugify(title).toLowerCase()
        blog.mtitle = `${title}| ${process.env.APP_NAME}`
        blog.mdesc = stripHtml(body.substring(0, 160))
        blog.postedBy = req.user.user.id
        //categories
        let arrayCategories = categories && categories.split(',')

        let arrayTags = tags && tags.split(',')
        if (files.photo) {
            if (files.photo.size > 10000000) {
                return res.status(400).json({
                    error: 'image should be less the 1 Mb in size'
                })
            }
            blog.photo.data = fs.readFileSync(files.photo.path)
            blog.photo.contentType = files.photo.type
        }

        blog.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            // res.json(result);
            Blog.findByIdAndUpdate(result._id, { $push: { categories: arrayCategories } }, { new: true }).exec((err, result) => {
                if (err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    })
                } else {
                    Blog.findByIdAndUpdate(result._id, { $push: { tags: arrayTags } }, { new: true }).exec((err, result) => {
                        if (err) {
                            return res.status(400).json({
                                error: errorHandler(err)
                            })
                        } else {
                            res.json(result)
                        }
                    })
                }

            })
        })
    })
}

//list, listAllBlogsCategoriesTags, remove, update, read

exports.list = (req, res) => {
    Blog.find({})
        .populate('categories', '_id name slug')
        .populate('tags', '_id name slug')
        .populate('postedBy', '_id name username profile')
        .select('_id title slug excerpt categories tags postedBy createdAt updatedAt')
        .exec((err, data) => {
            if (err) {
                return res.json({
                    error: errorHandler(err)
                })
            }
            res.json(data)
        })


}

exports.listAllBlogsCategoriesTags = (req, res) => {
    let limit = req.body.limit ? parseInt(req.body.limit) : 10;
    let skip = req.body.skip ? parseInt(req.body.skip) : 0;

    let blogs;
    let categories;
    let tags;

    Blog.find({})
        .populate('categories', '_id name slug')
        .populate('tags', '_id name slug')
        .populate('postedBy', '_id name username profile')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('_id title slug excerpt categories tags postedBy createdAt updatedAt')
        .exec((err, data) => {
            if (err) {
                return res.json({
                    error: errorHandler(err)
                });
            }
            blogs = data; // blogs
            // get all categories
            Category.find({}).exec((err, c) => {
                if (err) {
                    return res.json({
                        error: errorHandler(err)
                    });
                }
                categories = c; // categories
                // get all tags
                Tag.find({}).exec((err, t) => {
                    if (err) {
                        return res.json({
                            error: errorHandler(err)
                        });
                    }
                    tags = t;
                    // return all blogs categories tags
                    res.json({ blogs, categories, tags, size: blogs.length });
                });
            });
        });
};

exports.read = (req, res) => {
    const slug = req.params.slug.toLowerCase()
    Blog.findOne({ slug })
        // .select("-photo")
        .populate('categories', '_id name slug')
        .populate('tags', '_id name slug')
        .populate('postedBy', '_id name username profile')
        .select('_id title slug body mtitle mdesc categories tags postedBy createdAt updatedAt')
        .exec((err, data) => {
            if (err) {
                return res.json({
                    error: errorHandler(err)
                })
            }
            res.json(data)

        })

}

exports.remove = (req, res) => {
    const slug = req.params.slug.toLowerCase()
    Blog.findOneAndRemove({ slug }).exec((err, data) => {
        if (err) {
            return res.json({
                error: errorHandler(err)
            })
        }
        res.json({
            message: "Blog deleted Successfuly"
        })
    })
}

exports.update = (req, res) => {
    const slug = req.params.slug.toLowerCase()
    Blog.findOne({ slug }).exec((err, oldBlog) => {
        if (err) {
            return res.json({
                error: errorHandler(err)
            })
        }
        let form = new formidable.IncomingForm()
        form.keepExtensions = true
        form.parse(req, (err, fields, files) => {
            if (err) {
                return res.status(400).json({
                    error: 'image could not be uploaded'
                })
            }

            let slugBeforeMerge = oldBlog.slug
            oldBlog = _.merge(oldBlog, fields)
            oldBlog.slug = slugBeforeMerge
            const { body, mdesc, categories, tags } = fields
            if (body) {
                oldBlog.excerpt = smartTrim(body, 320, ' ', ' ...')
                oldBlog.mdesc = stripHtml(body.substring(0, 160))
            }

            if (categories) {
                oldBlog.categories = categories.split(',')
            }
            if (tags) {
                oldBlog.tags = tags.split(',')
            }

            if (files.photo) {
                if (files.photo.size > 10000000) {
                    return res.status(400).json({
                        error: 'image should be less the 1 Mb in size'
                    })
                }
                oldBlog.photo.data = fs.readFileSync(files.photo.path)
                oldBlog.photo.contentType = files.photo.type
            }

            oldBlog.save((err, result) => {
                if (err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    })
                }
                //result.photo = undefined
                res.json(result);

            })
        })
    })
}

exports.photo = (req, res) => {
    const slug = req.params.slug.toLowerCase()
    Blog.findOne({ slug })
        .select('photo')
        .exec((err, blog) => {

            if (err || !blog) {
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.set('Content-Type', blog.photo.contentType)
            return res.send(blog.photo.data)
        })
}

exports.listRelated = (req, res) => {
    let limit = req.body.limit ? parseInt(req.body.limit) : 5

    const { _id, categories } = req.body.blog
    Blog.find({ _id: { $ne: _id }, categories: { $in: categories } })
        .limit(limit)
        .populate('postedBy', '_id name username profile')
        .select('title slug excerpt postedBy ')
        .exec((err, blogs) => {
            if (err) {
                return res.status(400).json({
                    error: 'Blogs not found'
                })
            }
            res.json(blogs)
        })

}
exports.listSearch = (req, res) => {
    const { search } = req.query
    if (search) {
        Blog.find({
            $or: [{ title: { $regex: search, $options: 'i' } }, { body: { $regex: search, $options: 'i' } }]
        }, (err, blogs) => {
            if (err) {
                return res.status(400).json({
                    error: 'Blogs not found'
                })
            }
            res.json(blogs)
        }).select('-photo -body')
    }
}

exports.listByUser = (req, res) => {

    User.findOne({ username: req.params.username })
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            let userId = result._id
            Blog.find({ postedBy: userId })
                .populate('categories', '_id name slug')
                .populate('tags', '_id name slug')
                .populate('postedBy', '_id name username')
                .select('_id title slug postedBy createdAt updatedAt')
                .exec((err, data) => {
                    if (err) {
                        return res.status(400).json({
                            error: errorHandler(err)
                        })
                    }
                    res.json(data)
                })
        })
}