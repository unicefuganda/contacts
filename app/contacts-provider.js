var mongoose = require('mongoose');
RegExp.quote = require("regexp-quote");

var contactSchema = mongoose.Schema({ firstName: String,
    lastName: String,
    phone: { type: String, unique: true },
    createdOn: { type: Date, 'default': Date.now },
    updatedOn: Date });

var Contact = mongoose.model('Contact', contactSchema);


module.exports = function (dbURI) {
    if (mongoose.connection.readyState != 2) {
        var connectionURI = dbURI || 'mongodb://localhost/unicefcontacts';
        mongoose.connect(connectionURI);
    }

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
                .select('firstName lastName phone')
                .sort('firstName lastName')
                .exec(function (err, contacts) {
                    callback(err, contacts);
                });
        },

        find: function (matcher, callback) {
            var regexMatcher = new RegExp(RegExp.quote(matcher), 'i');
            Contact.find()
                .select('firstName lastName phone')
                .or([
                    { firstName: regexMatcher },
                    { lastName: regexMatcher },
                    { phone: regexMatcher }
                ])
                .sort('firstName lastName')
                .exec(function (err, contacts) {
                    callback(err, contacts);
                });
        },

        findById: function (contactId, callback) {
            Contact.findById(contactId)
                .select('firstName lastName phone')
                .exec(function (err, contact) {
                    callback(err, contact);
                });
        },
        delete: function (contactId, callback) {
            Contact.find({ _id: contactId }).remove(callback);
        },

        deleteAll: function () {
            Contact.remove({ }, function (err) {
            });
        }
    }
};
