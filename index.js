const express = require('express');
const app = express();
const userServices = require('./Services/User')

const PORT = 4000;

app.use('/', userServices)

app.get('/', (req, res) => {
    res.json({message: 'Welcome to the AucShop landing page'})
})

app.listen(PORT, (req, res) => {
    console.log(`Listening on port ${PORT}`)
})