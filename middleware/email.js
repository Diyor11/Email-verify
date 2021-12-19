const { v4: uuidv4 } = require('uuid')
const { VerifyUser } = require('../modules/User')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: '<exapmle>@outlook.com',
        pass: '************'
    }

})

transporter.verify((error, success) => {
    if(error){
        console.log('error: ' + error)
    } else {
        console.log('Verifield email transport: ' + success)
    }
})

const sendVerify = ({email, _id}, res) => {
    const url = 'http://localhost:8080/'
    const uniqueString = uuidv4() + _id

    const mailOptions = {
        from: 'diyorjsdeveloper@outlook.com',
        to: email,
        subject: 'Verify your Email',
        html: `<p>Verify your email address this link <b>expires 6 hour</b> </p>
        <h4>Press <a href=${url + 'user/verify/' + _id + '/'+ uniqueString}>Here</a> to proccessd</h4>`
    }

    VerifyUser.findOne({userId: _id})
        .then((account) => {
            console.log()
            if(account.expiresAt > Date.now()){
                res.send('We already send verify link this email: ' + email)
            } else {
                VerifyUser.deleteOne({userId: _id})
                    .then(() => {
                        bcrypt
                            .hash(uniqueString, 10)
                            .then((string) => { 
                                VerifyUser({
                                    userId: _id,
                                    uniqueString: string,
                                    createdAt: Date.now(),
                                    expiresAt: Date.now() + 21600000
                                })
                                    .save()
                                        .then(() => {
                                            transporter.sendMail(mailOptions)
                                                .then(() => res.send('We send new verify link your email: ' + email + ' please check your email'))
                                                .catch(() => res.send({error: 'Send verify link email error'}))
                                        })
                                        .catch(e => res.send({error: 'Data not saved'}))
                            })
                            .catch(e => res.send({error: 'Uniqstring hashing error'}))
                    })
                    .catch(() => res.send({error: 'Deleting exipered verify link error'}))
            }
        })
        .catch(() => {
            bcrypt
                .hash(uniqueString, 10)
                .then((string) => { 
                    VerifyUser({
                        userId: _id,
                        uniqueString: string,
                        createdAt: Date.now(),
                        expiresAt: Date.now() + 21600000
                    })
                        .save()
                            .then(() => {
                                transporter.sendMail(mailOptions)
                                    .then(() => res.send('We send message this email: ' + email + ' please check your email'))
                                    .catch(() => res.send({error: 'Send verify link email error'}))
                            })
                            .catch(e => res.send({error: 'Data not saved'}))
                })
                .catch(e => res.send({error: 'Uniqstring hashing error'}))
        })
}

module.exports = sendVerify
