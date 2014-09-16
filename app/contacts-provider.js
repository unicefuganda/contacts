var mongoose = require('mongoose');

var contactSchema = mongoose.Schema({ firstname: String,
    lastname: String,
    phone: { type: String, unique: true },
    createdOn: { type: Date, 'default': Date.now },
    updatedOn: Date });

var Contact = mongoose.model('Contact', contactSchema);


module.exports = function (dbURI) {
    if (mongoose.connection.readyState == 2) return;

    var connectionURI = dbURI || 'mongodb://localhost/unicefcontacts';
    mongoose.connect(connectionURI);

    return {
        add: function (contactDetails, callback) {
            var contact = new Contact(contactDetails);
            contact.save(function (err, savedContact) {
                callback(err, savedContact);
            });
        },

        addAll: function (contacts, callback) {
            Contact.create(contacts, function (err) {
                callback();
            });
        },

        edit: function (contact_id, contactDetails, callback) {
            Contact.findByIdAndUpdate(contact_id, { $set: contactDetails }, function (err, updatedContact) {
                callback(err, updatedContact);
            });
        },

        findAll: function (callback) {
            Contact.find({ })
                .select('firstname lastname phone')
                .exec(function (err, contacts) {
                    callback(err, contacts);
                });
        },

        find: function (matcher, callback) {
            Contact.find(matcher, function (err, contacts) {
                callback(err, contacts);
            });
        },

        findOne: function (matcher, callback) {
            Contact.findOne(matcher, function (err, contact) {
                callback(err, contact);
            });
        },

        deleteAll: function () {
            Contact.remove({ }, function (err) {
            });
        }

    }
};
