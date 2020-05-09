const mongoose = require('mongoose');
const newTag = {
    name: {
        type: String,
        trim: true,
        required: true,
        max: 32
    },
    slug: {
        type: String,
        unique: true,
        index: true
    }
}

const TagSchema = new mongoose.Schema(newTag, { timestamp: true });

const Tag = mongoose.model("Tag", TagSchema);
module.exports = Tag;