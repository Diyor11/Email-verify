const mongoose = require('mongoose')

const url = 'mongodb://localhost/EmailVerify'

module.exports = () => {
    mongoose.connect(url)
        .then(() => console.log('Mongodb connect...'))
        .catch(e => console.log('Mongodb connect error: ' + e.message))
}
