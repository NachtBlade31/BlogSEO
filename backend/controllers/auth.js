const User = require('../models/User')
const Blog = require('../models/Blog')
const shortId = require('shortid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const config = require('config');
const _ = require('lodash')
const { errorHandler } = require('../helpers/dbErrorHandler')
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
//Sign Up controller----Create a New Account

exports.preSignup = async (req, res) => {
    const { name, email, password } = req.body
    await User.findOne({ email: email.toLowerCase() }, (err, user) => {
        if (user) {
            return res.status(400).json({
                error: 'Email is taken'
            })
        }

        const token = jwt.sign({ name, email, password }, config.get('jwt_account_activation_secret'), { expiresIn: '10m' })

        //email
        const emailData = {
            to: email,
            from: process.env.EMAIL_FROM,
            subject: `Account activation Link`,
            html: `
            <p> Please use the following link to activate your account </p>
            <p> ${process.env.CLIENT_URL}/auth/account/activate/${token}</p>
            <hr />
            <p>This email may contain sensitive information</p>
            <p>https://seoblog.com</p>
            `
        }

        sgMail.send(emailData)
            .then(sent => {
                return res.json({
                    message: `Email has been sent to ${email}. Please check your Inbox.`
                })
            })
            .catch((error) => {
                console.log(error)
            })
    })
}


exports.signup = (req, res) => {
    const token = req.body.token
    if (token) {
        jwt.verify(token, config.get('jwt_account_activation_secret'), async function (err, decoded) {
            if (err) {
                return res.status(401).json({
                    error: "Expired link.Signup Again"
                })
            }

            let { name, email, password } = jwt.decode(token)
            const username = shortId.generate()
            const profile = `${process.env.CLIENT_URL}/profile/${username}`
            // Encrypt password and save user
            const salt = await bcrypt.genSalt(10);
            password = await bcrypt.hash(password, salt);

            const user = new User({ name, email, password, profile, username })
            user.save((err, user) => {
                if (err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    })
                }
                return res.json({
                    message: "Sign Up Success.Please SignIn"
                })
            })
        })
    }

    else {
        return res.json({
            message: "Something Went Wrong.Try again"
        })
    }
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

// forgetPassword, resetPassword 
exports.forgetPassword = (req, res) => {
    const { email } = req.body
    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(401).json({
                error: "User with that email does not exist"
            })
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_RESET_PASSWORD, { expiresIn: '10m' })
        //email
        const emailData = {
            to: process.env.EMAIL_TO,
            from: process.env.EMAIL_FROM,
            subject: `Password reset link`,
            html: `
            <p> Please use the following link to reset the password: </p>
            <p> ${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
            <hr />
            <p>This email may contain sensitive information</p>
            <p>https://seoblog.com</p>
            `
        }
        return user.updateOne({ resetPasswordLink: token }, (err, success) => {
            if (err) {
                return res.json({ error: errorHandler(err) })
            }
            else {
                sgMail.send(emailData)
                    .then(sent => {
                        return res.json({
                            message: `Email has been sent to ${email}.Follow the instruction to reset your password. Link expires in 10mins `
                        })
                    })
                    .catch((error) => {
                        console.log(error.response.body)
                    })

            }
        })
    })
}

exports.resetPassword = (req, res) => {
    //
    let { resetPasswordLink, newPassword } = req.body
    if (resetPasswordLink) {
        jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    error: 'Expired Link.Try again'
                })
            }
            User.findOne({ resetPasswordLink }, async (err, user) => {
                if (err || !user) {
                    return res.status(401).json({
                        error: 'Something went wrong .Try again'
                    })
                }
                let salt = await bcrypt.genSalt(10);
                newPassword = await bcrypt.hash(newPassword, salt);
                let updatedFields = {
                    password: newPassword,
                    resetPasswordLink: ''
                }
                user = _.extend(user, updatedFields)
                user.save((err, result) => {
                    if (err) {
                        return res.status(400).json({
                            error: errorHandler(err)
                        })
                    }
                    res.json({ message: `Great now you can login with your new password` })
                })
            })
        })
    }
}