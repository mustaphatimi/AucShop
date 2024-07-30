require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const userServices = require('./Services/User');
const runDBMigrations = require('./db');

const port = process.env.PORT || 4000;


app.use(bodyParser.json());
app.use('/users', userServices)

app.get('/', (req, res) => {
    res.json({message: 'Welcome to the AucShop landing page'})
})

const runAucShop = async () => {
    await runDBMigrations().then(() => {

        app.listen(port, (req, res) => {
            console.log(`Listening on port ${port}`)
        })
    }).catch(e => {
        console.log(e.message)
    })
}

runAucShop();