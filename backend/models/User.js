const mongoose = require('mongoose');
const newUser = {
    username: {
        typre: String,
        trim: true,
        required: true,
        max: 32,
        unique: true,
        index: true,
        lowercase: true
    },
    name: {
        typre: String,
        trim: true,
        required: true,
        max: 32
    },
    email: {
        typre: String,
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
        trim: true
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