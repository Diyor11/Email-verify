const express = require('express')
const router = express.Router()
const { User, userSignInValidater } = require('../modules/User')
const bcrypt = require('bcrypt')

router.post('/', async(req, res) => {
    const { error, value } = userSignInValidater.validate(req.body)
    if(error) return res.send({error: error.details[0].message})
    const user = await User.findOne({email: value.email})
    if(!user) return res.send({error: 'This email not found'})
    if(!user.verifield) return res.send({error: 'Email not verifield'})
    const checkPassword = await bcrypt.compare(value.password, user.password)
    if(!checkPassword) return res.send({error: 'Email or password invalid'})
    res.send({token: 'token', user})
})

module.exports = router