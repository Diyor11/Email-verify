const express = require('express')
const router = express.Router()
const { VerifyUser, User } = require('../modules/User')
const bcrypt = require('bcrypt')

router.get('/:userId/:uniqueString', (req, res) => {
    const { userId, uniqueString } = req.params

    VerifyUser.find({userId})
        .then(result => {
            if(result.length > 0){
                if(result[0].expiresAt < Date.now()) {
                    VerifyUser.deleteOne({userId})
                        .then(() => {
                            res.send('Link has expired please sign up again')
                        })
                        .catch(() => res.send('Clearing apired Verify user failed'))
                    res.send(`<h1>This invalid link please re sign up</h1>`)
                } else {
                    const hashedString = result[0].uniqueString

                    bcrypt.compare(uniqueString, hashedString)
                        .then(result => {
                            if(result) {

                                User.findByIdAndUpdate(userId, {verifield: true}, {new: true})
                                    .then((updated) => {
                                        VerifyUser.deleteOne({userId})
                                            .then(() => res.send(`<h1>You success verifyed you may go home page user: ${updated.verifield}</h1>`))
                                            .catch(() => res.send('<h3>Deleting verify user Error</h3>'))
                                    })
                                    .catch(() => {
                                        res.send({error: 'User verifing error'})
                                    })
                            } else {
                                res.send({error: 'Invalid verification details plsease check your inbox'})
                            }
                        })
                        .catch(e => res.send({error: 'An error while comparing unique string'}))
                }
            } else {
                res.send('Account don\'t exit')
            }
        })
        .catch(e => res)
})

module.exports = router