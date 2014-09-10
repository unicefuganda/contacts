var mongoose = require('mongoose');

var contactSchema = mongoose.Schema({ firstname: String,
                                      lastname: String,
                                      phone: { type: String, unique: true },
                                      createdOn: { type: Date, 'default': Date.now },
                                      updatedOn: Date });

var Contact = mongoose.model('Contact', contactSchema);

//REFACTOR: move this to an environment variable
var ContactProvider = function(dbURI) {
    if(dbURI) {
        mongoose.connect(dbURI);
    }
    else {
        mongoose.connect('mongodb://localhost/unicefcontacts');
    }
};

ContactProvider.prototype.add = function(contactDetails, callback) {
  var contact = new Contact(contactDetails);
  contact.save(function (err, savedContact) {
    callback( err, savedContact);
  });
};

ContactProvider.prototype.addAll = function(contacts, callback) {
  Contact.create(contacts, function (err) {
    callback();
  });
};

ContactProvider.prototype.findAll = function(callback) {
  Contact.find( { }, function (err, contacts) {
    callback( err, contacts);
  });
};

ContactProvider.prototype.find = function(matcher, callback) {
  Contact.find( matcher, function (err, contacts) {
    callback( err, contacts);
  });
};

ContactProvider.prototype.deleteAll = function() {
  Contact.remove( { }, function (err) {
  });
};

module.exports = ContactProvider;
