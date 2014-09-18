var mongoose = require('mongoose');
var ContactService = require('../app/contacts-service')();


var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var router = express.Router();
var port = process.env.PORT || 8005;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

router.use(function (req, res, next) {
    console.log('received request at ' + Date.now());
    next();
});

router.get('/', ContactService.welcomeMessage);

router.get('/contacts', ContactService.find);

router.get('/contacts/:id', ContactService.findById);

router.post('/contacts/add', ContactService.add);

router.put('/contacts/edit', ContactService.edit);

app.use('/api', router);

app.listen(port);

console.log('Contacts service running ' + port);

module.exports = app;
