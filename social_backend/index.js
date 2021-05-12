const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose');
const colors = require('colors')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(morgan('tiny'))


app.listen(3001, () => {
    console.log('API listening on port 3001');
})