var mongoose = require('mongoose');
var _ = require('underscore');
RegExp.quote = require("regexp-quote");

var contactSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    fullName: String,
    phone: {type: String, unique: true},
    createdOn: {type: Date, 'default': Date.now},
    createdByUserId: Number,
    updatedOn: Date
});

var Contact = mongoose.model('Contact', contactSchema);

var extendFullName = function(contact) {
    _.extend(contact, {fullName: contact.firstName + ' ' + contact.lastName});
};

module.exports = function (dbURI) {
    if (mongoose.connection.readyState != 2) {
        var connectionURI = dbURI || 'mongodb://localhost/unicefcontacts';
        mongoose.connect(connectionURI);
    }

    return {
        add: function (contactDetails, callback) {
            extendFullName(contactDetails);

            var contact = new Contact(contactDetails);
            contact.save(function (err, savedContact) {
                callback(err, savedContact);
            });
        },

        addAll: function (contacts, callback) {
            for (var i = 0; i < contacts.length; i++) {
                var contact = contacts[i];
                extendFullName(contact);
            }

            Contact.create(contacts, function (err) {
                callback();
            });
        },

        edit: function (contact_id, contactDetails, callback) {
            extendFullName(contactDetails);
            Contact.findByIdAndUpdate(contact_id, {$set: contactDetails}, function (err, updatedContact) {
                callback(err, updatedContact);
            });
        },

        findAll: function (callback) {
            Contact.find({})
                .select('firstName lastName phone')
                .sort('firstName lastName')
                .exec(function (err, contacts) {
                    callback(err, contacts);
                });
        },

        find: function (matcher, callback) {
            var regexMatcher = new RegExp(RegExp.quote(matcher), 'i');
            Contact.find()
                .select('firstName lastName phone fullName')
                .or([
                    {firstName: regexMatcher},
                    {lastName: regexMatcher},
                    {phone: regexMatcher},
                    {fullName: regexMatcher}
                ])
                .sort('firstName lastName')
                .exec(function (err, contacts) {
                    callback(err, contacts);
                });
        },

        findExtended: function (createdbyuserid, matcher, callback) {
            var query = Contact.find()
                .select('firstName lastName phone fullName');

            if (createdbyuserid) {
                query.where('createdByUserId').equals(createdbyuserid)
            }

            if (matcher) {
                var regexMatcher = new RegExp(RegExp.quote(matcher), 'i');
                query.or([
                    {firstName: regexMatcher},
                    {lastName: regexMatcher},
                    {phone: regexMatcher},
                    {fullName: regexMatcher}
                ])
            }

            query.sort('firstName lastName')
            query.exec(function (err, contacts) {
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
            Contact.find({_id: contactId}).remove(callback);
        },

        deleteAll: function () {
            Contact.remove({}, function (err) {
            });
        }
    };
};
