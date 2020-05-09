const Tag = require('../models/Tag')
const slugify = require('slugify')
const { errorHandler } = require('../helpers/dbErrorHandler')
exports.create = async (req, res) => {
    const { name } = req.body
    let slug = slugify(name).toLowerCase()

    let tag = new Tag({ name, slug })

    await tag.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        console.log(data)

        res.json(data)
    })
}

exports.list = async (req, res) => {
    await Tag.find({}).exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json(data)
    })

}

exports.read = async (req, res) => {
    const slug = req.params.slug.toLowerCase()
    await Tag.findOne({ slug }).exec((err, tag) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json(tag)
    })
}

exports.remove = async (req, res) => {
    const slug = req.params.slug.toLowerCase()
    await Tag.findOneAndRemove({ slug }).exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json({
            message: "Tag Deleted Successfully"
        })
    })
}