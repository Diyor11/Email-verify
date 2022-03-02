const express = require('express')
const router = express.Router()
const { User, VerifyUser, userValidater } = require('../modules/User')
const sendVerify = require('../middleware/email')
const bcrypt = require('bcrypt')

router.post('/', async(req, res) => {
    const { error, value } = userValidater.validate(req.body)
    if(error) return res.send(error.details[0].message)

    const exitUser = await User.findOne({email: value.email})
    
    if(exitUser && exitUser.verifield){
        res.send({error: 'This user alredy exist'})
    } else if(exitUser){
        const userValid = await VerifyUser.findOne({userId: exitUser._id})
        if(userValid && userValid.expiresAt > Date.now()){
            res.send({code: 1, message: 'Allready sended'})
        } else if(userValid && userValid.expiresAt < Date.now()){
            await VerifyUser.deleteOne(userValid).catch(e => console.log('Error delete expired verify doc'))
            sendVerify(exitUser, res)
        } else{
            sendVerify(exitUser, res)
        }
    } else {    
        const hashed = await bcrypt.hash(value.password, 10)
        if(hashed){
            const newUser = await User({...value, password: hashed}).save()
            if(newUser) {
                sendVerify(newUser, res)
            } else {
                console.log('Error saving new user')
                res.send({error: 'Error saving new user'})
            }
        } else {
            console.log('Error generation bcrypt password')
            res.status(500).send({error: 'Error generation bcrypt password'})
        }
    }
})

module.exports = router