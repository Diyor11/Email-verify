const express = require('express')
const router = express.Router()
const { User, userSignInValidater } = require('../modules/User')
const bcrypt = require('bcrypt')

router.post('/', (req, res) => {
    const { error, value } = userSignInValidater.validate(req.body)

    if(error) return res.send({error: error.details[0].message})
    
    User.findOne({email: value.email})
        .then(data => {
            if(!data) return res.send({error: 'This email not found'})
            if(!data.verifield) return res.send({error: "this account not verifield please sign in again"}) 

            bcrypt.compare(data.password, value.password)
                .then(result => {
                    if(!res) return res.send({error: 'Email or password invalid'})
                    res.send({token: 'token', data})
                })
        })
})

module.exports = router