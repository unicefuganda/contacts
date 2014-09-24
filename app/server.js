var ContactService = require('../app/contacts-service')();


var express = require('express');
var bodyParser = require('body-parser');
var corsMiddleware = require('../app/middleware/cors')();

var app = express();
var router = express.Router();
var port = process.env.PORT || 8005;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app = corsMiddleware.allowCors(app);

router.get('/', ContactService.welcomeMessage);

router.get('/contacts/', ContactService.find);

router.get('/contacts/:id', ContactService.findById);

router.post('/contacts/', ContactService.add);

router.put('/contacts/', ContactService.edit);

app.use('/api', router);

app.listen(port);

module.exports = app;
