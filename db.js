const mongoose = require('mongoose')

const url = 'mongodb+srv://Diyor11:diyor972676163@cluster0.v7bmx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
// const url = 'mongodb://localhost/EmailVerify'

module.exports = () => {
    mongoose.connect(url)
        .then(() => console.log('Mongodb connect...'))
        .catch(e => console.log('Mongodb connect error: ' + e.message))
}