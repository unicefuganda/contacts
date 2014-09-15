var mongoose = require('mongoose');

var contactSchema = mongoose.Schema({ firstname: String,
                                      lastname: String,
                                      phone: { type: String, unique: true },
                                      createdOn: { type: Date, 'default': Date.now },
                                      updatedOn: Date });

var Contact = mongoose.model('Contact', contactSchema);

var ContactsProvider = function(dbURI) {
    if(mongoose.connection.readyState == 2) return;

    var connectionURI = dbURI || 'mongodb://localhost/unicefcontacts'

    mongoose.connect(connectionURI);
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
  Contact.find({ })
      .select('firstname lastname phone')
      .exec(function (err, contacts) {
          callback( err, contacts);
      });
};

ContactsProvider.prototype.find = function(matcher, callback) {
  Contact.find( matcher, function (err, contacts) {
    callback( err, contacts);
  });
};

ContactsProvider.prototype.findOne = function(matcher, callback) {
  Contact.findOne( matcher, function (err, contact) {
    callback( err, contact);
  });
};

ContactsProvider.prototype.deleteAll = function() {
  Contact.remove( { }, function (err) {
  });
};

module.exports = ContactsProvider;
