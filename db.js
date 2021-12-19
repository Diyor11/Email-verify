const mongoose = require('mongoose')

module.exports = () => {
    mongoose.connect('mongodb://localhost/EmailVerify')
        .then(() => console.log('Mongodb connect...'))
        .catch(e => console.log('Mongodb connect error: ' + e.message))
}