const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;
const newBlog = {
    title: {
        type: String,
        trim: true,
        min: 3,
        max: 160,
        required: true
    },
    slug: {
        type: String,
        unique: true,
        index: true,
        required: true
    },
    body: {
        type: {},
        required: true,
        min: 200,
        max: 2000000
    },
    excerpt: {
        type: String,
        max: 1000
    },
    mtitle: {
        type: String
    },
    mdesc: {
        type: String
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    categories: [{ type: ObjectId, ref: 'Category', required: true }],
    tags: [{ type: ObjectId, ref: 'Tag', required: true }],
    postedBy: {
        type: ObjectId,
        ref: 'User'
    }
}

const BlogSchema = new mongoose.Schema(newBlog, { timestamps: true });

const Blog = mongoose.model("Blog", BlogSchema);
module.exports = Blog;