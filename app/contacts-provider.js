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
            if (!contact.createdByUserId) {
                throw new Error('Param createdByUserId cannot be empty')
            }

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
            // CreatedByUserId should not be changed in editing.
            delete contactDetails["createdByUserId"];
            Contact.findByIdAndUpdate(contact_id, {$set: contactDetails}, function (err, updatedContact) {
                callback(err, updatedContact);
            });
        },

        findAll: function (callback) {
            this.findExtended(undefined, undefined, callback);
        },

        find: function (matcher, callback) {
            this.findExtended(undefined, matcher, callback);
        },

        findExtended: function (createdByUserId, matcher, callback) {
            var query = Contact.find()
                .select('firstName lastName phone fullName createdByUserId');

            if (createdByUserId) {
                query.where('createdByUserId').equals(createdByUserId)
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
