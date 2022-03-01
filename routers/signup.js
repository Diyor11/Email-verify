const express = require('express')
const router = express.Router()
const { User, VerifyUser, userValidater } = require('../modules/User')
const sendVerify = require('../middleware/email')

router.post('/', async(req, res) => {
    const { error, value } = userValidater.validate(req.body)

    if(error) return res.send(error.details[0].message)

    console.log(value, error)

    const exitUser = await User.findOne({email: value.email})
    if(!exitUser){
        console.log('first one')
        User(value).save()
            .then(user => {
                sendVerify(user, res)
            })
            .catch(e => res.send(e.message))
    }
    else if(exitUser && exitUser.verifield) {
        return res.send({error: 'this user alredy exist'})
    } else {
        console.log('create new lik')
        VerifyUser.findOne({userId: exitUser._id})
            .then(userVerify => {
                if(userVerify.expiresAt > Date.now()){
                    res.send('We already sent message your email please check your email it may be spam folder')
                } else {
                    VerifyUser.deleteOne(userVerify)
                        .then(() => {
                            sendVerify(exitUser, res)
                        })
                        .catch(() => res.send({error: 'Delete expired link error'}))
                }
            })
            .catch(() => {
                sendVerify(exitUser, res)
            })
    }
})

module.exports = router