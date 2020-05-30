const User = require('../models/User')
const Blog = require('../models/Blog')
const shortId = require('shortid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const config = require('config');
const { errorHandler } = require('../helpers/dbErrorHandler')
//Sign Up controller----Create a New Account
exports.signup = async (req, res) => {
    const { name, email, password } = req.body
    let user = await User.findOne({ email });
    if (user) {
        return res.status(400).json({ error: 'User already exist' });
    }

    const username = shortId.generate()
    const profile = `${process.env.CLIENT_URL}/profile/${username}`

    //create  the user
    user = new User({
        name,
        email,
        password,
        username,
        profile
    });


    //Encrypt password and save user
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save((err, success) => {
        if (err) {
            return res.status(400).json({ errors: err });
        }
        //res.json({user:success})
        res.json({ message: "Sign up success, Please Sign In" })
    });

}

//Sign In controller----Log in into your account

exports.login = async (req, res) => {
    //Check if user exist

    const { email, password } = req.body
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'No User Found, Please check again.' });
        }
        //authenticate
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid Credentials' });
        }
        //generate a token and send to client

        //Return jsonwebtoken
        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(payload, config.get('jwtSecret'),
            { expiresIn: '1d' },
            (err, token) => {
                if (err) {
                    throw err;
                }
                else {
                    res.cookie('token', token, { expiresIn: '1d' })
                    const { _id, name, username, email, role } = user
                    res.json({ token, user: { _id, name, username, email, role } });
                }
            }
        );

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
}


///Logout functionailty---

exports.logout = async (req, res) => {
    res.clearCookie("token")
    res.json({
        message: "Logged Out Successfully"
    });
}

exports.requireLoggedin = expressJwt({
    secret: config.get('jwtSecret')
})

exports.authMiddleWare = (req, res, next) => {
    const authUserId = req.user.user.id
    User.findById({ _id: authUserId }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not Found'
            })
        }

        req.profile = user
        next()
    })
}

exports.adminMiddleWare = (req, res, next) => {
    const adminUserId = req.user.user.id
    User.findById({ _id: adminUserId }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not Found'
            })
        }
        if (user.role !== 1) {
            return res.status(400).json({
                error: 'Unauthorised content'
            })
        }

        req.profile = user
        next()
    })
}

exports.canUpdateDelete = (req, res, next) => {
    const slug = req.params.slug.toLowerCase()
    Blog.findOne({ slug }).exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        let authorizedUser = data.postedBy._id.toString() === req.profile._id.toString()
        if (!authorizedUser) {
            return res.status(400).json({
                error: 'You are not authorsed to edit this'
            })
        }
        next();
    })
}