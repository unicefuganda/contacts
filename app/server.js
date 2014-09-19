var ContactService = require('../app/contacts-service')();


var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var router = express.Router();
var port = process.env.PORT || 8005;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, X-Token, X-Username');
    next();
};

var logRequest = function(req, res, next) {
    console.log('received request at ' + Date.now());
    next();
};

router.use(allowCrossDomain);

router.use(logRequest);

router.get('/', ContactService.welcomeMessage);

router.get('/contacts/', ContactService.find);

router.get('/contacts/:id', ContactService.findById);

router.post('/contacts/', ContactService.add);

router.put('/contacts/', ContactService.edit);

app.use('/api', router);

app.listen(port);

console.log('Contacts service running ' + port);

module.exports = app;
