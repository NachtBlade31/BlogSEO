const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
exports.contactForm = (req, res) => {
    const { name, email, message } = req.body;

    const emailData = {
        to: process.env.EMAIL_TO,
        from: email,
        subject: `Contact form-${process.env.APP_NAME}`,
        text: `Email received from contact from \n Sender Name: ${name} \n Sender Email :${email} \n Sender Message: ${message} `,
        html: `
        <h4>Email received fro Contact Form</h4>
        <p> Sender Name: ${name}</p>
        <p> Sender Email: ${email}</p>
        <p> Sender Message: ${message}</p>
        <hr />
        <p>This email may contain sensitive information</p>
        <p>https://seoblog.com</p>
        `
    }

    sgMail.send(emailData).then(sent => {
        return res.json({
            success: true
        })
    }).catch((error) => {
        console.log(error.response.body)
        // console.log(error.response.body.errors[0].message)
    })
}

exports.contactBlogAuthorForm = (req, res) => {
    const { authorEmail, name, email, message } = req.body;
    let mailList = [process.env.EMAIL_TO, authorEmail]
    const emailData = {
        to: mailList,
        from: email,
        subject: `Someone messaged you from ${process.env.APP_NAME}`,
        text: `Email received from contact from \n Sender Name: ${name} \n Sender Email :${email} \n Sender Message: ${message} `,
        html: `
        <h4>Message received from:/h4>
        <p> Name: ${name}</p>
        <p> Email: ${email}</p>
        <p> Message: ${message}</p>
        <hr />
        <p>This email may contain sensitive information</p>
        <p>https://seoblog.com</p>
        `
    }

    sgMail.send(emailData).then(sent => {
        return res.json({
            success: true
        })
    }).catch((error) => {
        console.log(error.response.body)
        // console.log(error.response.body.errors[0].message)
    })
}