const nodemailer = require('nodemailer');

module.exports = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: Number(process.env.MAIL_PORT),
            secure: true, // true for 465, false for other ports
            auth: {
                user: process.env.MAIL_USER, // generated ethereal user
                pass: process.env.MAIL_PASSWORD, // generated ethereal password
            },
        });

        await transporter.sendMail({
            from: process.env.MAIL_USER, //server user
            to: email,
            subject: subject,
            text: text
        });
        console.log("email send successfully");
        return false;
    }
    catch (err) {
        return err;
    }
}