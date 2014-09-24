var ContactService = require('../app/contacts-service')();


var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var router = express.Router();
var port = process.env.PORT || 8005;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use("/api/*", function (request, response, next) {
    response.header('Access-Control-Allow-Origin', 'http://localhost:8000');
    next();
});

router.get('/', ContactService.welcomeMessage);

router.get('/contacts/', ContactService.find);

router.get('/contacts/:id', ContactService.findById);

router.post('/contacts/', ContactService.add);

router.put('/contacts/', ContactService.edit);

app.use('/api', router);

app.listen(port);

module.exports = app;
