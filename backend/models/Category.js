const mongoose = require('mongoose');
const newCatagory = {
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

const CategorySchema = new mongoose.Schema(newCatagory, { timestamps: true });

const Category = mongoose.model("Category", CategorySchema);
module.exports = Category;