require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const userServices = require('./Services/User');
const adminServices = require('./Services/Admin');
const productServices = require('./Services/Product');
const { connectDB } = require('./db');
const port = 4000;


app.use(bodyParser.json());
app.use('/users', userServices)
app.use('/admin', adminServices)
app.use('/product', productServices)

app.get('/', (req, res) => {
    res.json({message: 'Welcome to the AucShop landing page'})
})

connectDB()
    .then(() => {
        app.listen(port, (req, res) => {
            console.log(`Listening on port ${port}`)
})
})


app.use((err, req, res, next) => {
      const { message = 'Server error!', status = 500 } = err;
    return res.status(status).json({ error: message })
})
