const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyparser = require('body-parser');

require('dotenv').config();

const app = express();

app.use(bodyparser.json());

app.use(express.static(path.resolve(__dirname, '..')));

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false
}));

app.post('/login', (req, res) => {
    req.session.name = req.body.name;
    res.status(200).send('Logged in successfully!');
});

app.listen(process.env.PORT, '0.0.0.0', () => {
    console.log('Server is running.');
});