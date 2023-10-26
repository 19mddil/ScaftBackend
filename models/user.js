const { Schema, model } = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

const userSchema = Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    verified: {
        type: String,
        enum: ['true', 'false'],
        default: 'false'
    },

}, { timestamps: true });

userSchema.methods.genJWT = function () {
    const token = jwt.sign({
        _id: this._id,
        name: this.name,
        email: this.email,
        role: this.role,
        verified: this.verified,
    }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });
    return token;
}

const validateUser = user => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(100).required(),
        email: Joi.string().min(5).max(255).required(),
        password: Joi.string().min(5).max(255).required(),
        role: Joi.string().min(4).max(255)
    });
    return schema.validate(user);
}

module.exports.User = model('users', userSchema);
module.exports.validate = validateUser 