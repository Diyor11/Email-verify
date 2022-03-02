const express = require('express')
const router = express.Router()
const { VerifyUser, User } = require('../modules/User')
const bcrypt = require('bcrypt')

router.get('/:userId/:uniqueString', async(req, res) => {
    const { userId, uniqueString } = req.params

    const confirm = await VerifyUser.findOne({userId})

    if(confirm && confirm.expiresAt < Date.now()){
        res.send({error: 'This link expired please sign up again'})
    }
    else if(confirm){
        const validLink = await bcrypt.compare(uniqueString, confirm.uniqueString)
        if(validLink){
            User.updateOne({_id: confirm.userId}, {verifield: true})
                .then(d => {
                    res.render('success', {email: confirm.email})
                    confirm.deleteOne().catch(() => console.log('error delete verify doc'))
                })
                .catch(e => res.status(404).send({error: 'User not found'}))
        } else {    
            res.render('fail', {email: confirm.email})
        }
    } else {
        res.status(404).send({error: 'Error confirm document not found'})
    }
})

module.exports = router