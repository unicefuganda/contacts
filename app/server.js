var mongoose = require('mongoose');
var ContactsProvider = require('../app/contacts-provider');
var contactsProvider = new ContactsProvider();
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var router = express.Router();
var port = process.env.PORT || 8005;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

router.use(function(req, res, next) {
    console.log('received request at ' + Date.now());
    next();
});

router.get('/', function(req, res) {
  res.json({ message: 'UNICEF contacts service API' });
});

router.get('/contacts', function(req, res) {
  contactsProvider.findAll(function(err, contacts) {
    res.json(contacts);
  });
});

router.post('/contacts/add', function(req, res) {
  contactsProvider.add({ firstname : req.param('firstname'), lastname : req.param('lastname'), phone :  req.param('phone')},
     function(err, contact) {
         res.json({ _id : contact._id.toString(), firstname : contact.firstname, lastname : contact.lastname, phone :  contact.phone });
    });
});

app.use('/api', router);
app.listen(port);

console.log('Contacts service running ' + port);

module.exports = app;
