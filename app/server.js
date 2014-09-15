var mongoose = require('mongoose');
var ContactsProvider = require('../app/contacts-provider');
var PhoneValidator = require('../app/phone-validator');

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
  var phoneNumber = req.param('phone');
  var phoneValidator = new PhoneValidator(phoneNumber);

  phoneValidator.format(function(err, formattedNumber) {
    if(err) return res.status(400).json(err);

    contactsProvider.add({ firstname : req.param('firstname'), lastname : req.param('lastname'), phone :  formattedNumber},
     function(err, contact) {
      res.json({ _id : contact._id.toString(), firstname : contact.firstname, lastname : contact.lastname, phone :  contact.phone });
    });
  });
});

router.put('/contacts/edit', function(req, res) {
  var phoneNumber = req.param('phone');
  var phoneValidator = new PhoneValidator(phoneNumber);

  phoneValidator.format(function(err, formattedNumber) {
    if(err) return res.status(400).json(err);

    contactsProvider.edit(req.param('_id'), { firstname : req.param('firstname'), lastname : req.param('lastname'), phone :  formattedNumber},
     function(err, contact) {
      res.json({ _id : contact._id.toString(), firstname : contact.firstname, lastname : contact.lastname, phone :  contact.phone });
    });
  });
});

app.use('/api', router);
app.listen(port);

console.log('Contacts service running ' + port);

module.exports = app;
