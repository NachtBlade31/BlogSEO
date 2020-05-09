const mongoose = require('mongoose');
const newUser = {
    username: {
        type: String,
        trim: true,
        required: true,
        max: 32,
        unique: true,
        index: true,
        lowercase: true
    },
    name: {
        type: String,
        trim: true,
        required: true,
        max: 32
    },
    email: {
        type: String,
        trim: true,
        required: true,
        max: 32,
        unique: true,
        lowercase: true
    },
    profile: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true

    },
    about: {
        type: String
    },
    role: {
        type: Number,
        default: 0
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    resetPasswordLink: {
        data: String,
        default: ''
    }
}

const UserSchema = new mongoose.Schema(newUser, { timestamp: true });

const User = mongoose.model("User", UserSchema);
module.exports = User;