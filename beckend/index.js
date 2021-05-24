const express = require('express')
const app = express()
const consign = require('consign')
const db = require('./config/db')
const port = 3001

app.db = db

consign()
    .then('./config/middleware.js')
    .then('./api/validations.js')
    .then('./api')
    .then('./config/routes.js')
    .into(app)

app.listen(port, () => console.log(`Servidor rodando na PORTA:${port}`))

app.use(express.static('../frontend/tupinamba/build'))
