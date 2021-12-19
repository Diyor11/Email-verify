const express = require('express')
const app = express()

app.use(express.json())
require('./db')()

app.use('/api/signup', require('./routers/signup'))
app.use('/api/signin', require('./routers/signin'))
app.use('/user/verify', require('./routers/verifyUser'))

app.listen(8080, () => console.log('Server working localhost:' + 8080))
