var mongoose = require('mongoose');

var contactSchema = mongoose.Schema({ firstname: String,
                                      lastname: String,
                                      phone: { type: String, unique: true },
                                      createdOn: { type: Date, 'default': Date.now },
                                      updatedOn: Date });

var Contact = mongoose.model('Contact', contactSchema);

//REFACTOR: move this to an environment variable
var ContactsProvider = function(dbURI) {
    if(dbURI) {
        mongoose.connect(dbURI);
    }
    else {
        mongoose.connect('mongodb://localhost/unicefcontacts');
    }
};

ContactsProvider.prototype.add = function(contactDetails, callback) {
  var contact = new Contact(contactDetails);
  contact.save(function (err, savedContact) {
    callback( err, savedContact);
  });
};

ContactsProvider.prototype.addAll = function(contacts, callback) {
  Contact.create(contacts, function (err) {
    callback();
  });
};

ContactsProvider.prototype.findAll = function(callback) {
  Contact.find( { }, function (err, contacts) {
    callback( err, contacts);
  });
};

ContactsProvider.prototype.find = function(matcher, callback) {
  Contact.find( matcher, function (err, contacts) {
    callback( err, contacts);
  });
};

ContactsProvider.prototype.deleteAll = function() {
  Contact.remove( { }, function (err) {
  });
};

module.exports = ContactsProvider;
