const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'src')));
app.use('/mdb', express.static(__dirname + '/node_modules/mdbootstrap')); //loading boostrap material design


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/index.html'));
});

app.get('/', function (req, res, next) {
    res.render('index');
});

module.exports = app;
