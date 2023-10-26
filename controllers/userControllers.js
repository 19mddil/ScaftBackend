const bcrypt = require('bcryptjs');
const _ = require('lodash');
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const { User, validate } = require('../models/user');
const Sendemail = require('../utils/sendEmail');



module.exports.SignUp = async (req, res) => {
    let { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let user = {};
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGODB_URL_LOCAL);
        console.log("Connection successfull");
    }
    user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User Already Exists');
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
    user = await User.create(req.body);
    res.status(201).send({ messeage: "Registraton Successful", user: _.pick(user, ['name', 'email', 'password', 'role']), token: user.genJWT() });
}

module.exports.SignIn = async (req, res) => {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGODB_URL_LOCAL);
        console.log("Connection successfull");
    }
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("email or password error");
    const boolvar = await bcrypt.compare(req.body.password, user.password);
    if (boolvar) {
        return res.status(201).send({ messeage: "Login Successful", user: _.pick(user, ['name', 'email', 'password', 'role']), token: user.genJWT() });
    } else {
        return res.status(400).send("username or password error");
    }
}

module.exports.SendEmail = async (req, res) => {
    try {
        console.log("Sending Email....");
        console.log(req.body);
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).send(new Error("user doesn't exist please register"));
        }
        let error = await Sendemail(req.body.email, "Verify Code", req.body.code);
        console.log("here", error.message);
        if (error) {
            return res.status(500).send({ msg: error.message });
        }
        return res.status(201).send({ message: "email sent successfully" })
    } catch (err) {
        console.log(err);
        return res.status(500).send("Email couldn't be sent");
    }
}

module.exports.VerifyEmail = async (req, res) => {
    try {
        const result = await User.updateOne({ email: req.body.email }, { $set: { "verified": "true" } })
        if (!result) {
            return res.status(403).send("couldn't verify the user,try again later");
        }
        const user = await User.findOne({ email: req.body.email });
        return res.status(201).send({ messeage: "Email Verification Successful", user: _.pick(user, ['name', 'email', 'password', 'role']), token: user.genJWT() });

    }
    catch (err) {
        return res.status(500).send(err.message);
    }
}

module.exports.SetNewPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(409).send("User does not exist, Please Register.");
        const salt = await bcrypt.genSalt(10);
        console.log(salt);
        console.log(req.body.password);
        req.body.password = await bcrypt.hash(req.body.password, salt);
        await User.updateOne({ email: req.body.email }, { $set: { "password": req.body.password, "verified": "true" } })
        return res.status(201).send({ messeage: "User Password Successfully Updated" });
    } catch (err) {
        console.log(err);
        return res.status(500).send(err.message);
    }

}