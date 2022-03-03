const { v4: uuidv4 } = require('uuid')
const { VerifyUser } = require('../modules/User')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const smtpTransport = require('nodemailer-smtp-transport')

// const transporter = nodemailer.createTransport(smtpTransport({
//     host: "my.smtp.host",
//     port: 465,
//     secure: true,
//     tls: {
//         ciphers: "SSLv3",
//         rejectUnauthorized: false,
//     },
//     auth: {
//         user: 'diyorjsdeveloper@outlook.com',
//         pass: 'diyor977382310'
//     }
// }))

const transporter = nodemailer.createTransport({
    // host: 'smtp-mail.outlook.com',
    // port: 587,
    host: 'hotmail',
    auth: {
        user: 'diyorjsdeveloper@outlook.com',
        pass: 'diyor977382310'
    }
})

transporter.verify((error, success) => {
    if(error){
        console.log('Xato: ' + error)
    } else {
        console.log('Verifield email transport: ' + success)
    }
})


const sendVerify = async({email, _id}, res) => {
    const url = 'http://localhost:8080/'
    const uniqueString = uuidv4() + _id

    const mailOptions = {
        from: 'diyorjsdeveloper@outlook.com',
        to: email,
        subject: 'Verify your Email',
        html: `<h2>Verify your email address this link <b>expires 6 hour</b> </h2>
        <h3>Press <a style="font-size: 25px" href=${url + 'user/verify/' + _id + '/'+ uniqueString}>Here</a> to proccessd</h3>`
    }

    const hashedString = await bcrypt.hash(uniqueString, 10)

    if(hashedString){
        const confirm = await VerifyUser({userId: _id, uniqueString: hashedString, createdAt: Date.now(), expiresAt: Date.now() + 21600000}).save()
        if(confirm){
            transporter.sendMail(mailOptions)
                .then((d) => res.send({code: 0, message: 'Sended'}))
                .catch(() => {
                    console.log('Send verify link email error')
                    res.send({error: 'Send verify link email error'})
                })
        } else {
            console.log('Error saveing verify document')
            res.send({error: 'Error saveing verify document'})
        }
    } else {
        console.log('Error bcrypt generation password')
        res.send({error: 'Server bcrypt error'})
    }
}

module.exports = sendVerify
