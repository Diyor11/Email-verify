const mongoose = require('mongoose')
const Joi = require('joi')

const User = mongoose.model('User', new mongoose.Schema({
    name: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: String,
    verifield: {
        type: Boolean,
        default: false
    }
}))

const VerifyUser = mongoose.model('VerifyUser', new mongoose.Schema({
    userId: String,
    uniqueString: String,
    createdAt: Date,
    expiresAt: Date
}))

const userValidater = Joi.object({
    name: Joi.string().required().min(3),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(5),
})

const userSignInValidater = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(5).required()
})


module.exports = {User, VerifyUser, userValidater, userSignInValidater}