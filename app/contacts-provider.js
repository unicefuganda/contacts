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
                .exec(function (err, contacts) {
                    callback(err, contacts);
                });
        },

        find: function (matcher, callback) {
            var regexMatcher = new RegExp(RegExp.quote(matcher), 'i');
            Contact.find()
              .select('firstname lastname phone')
              .or([{ firstname: regexMatcher }, { lastname: regexMatcher }, { phone: regexMatcher }])
              .exec(function (err, contacts) {
                callback( err, contacts);
              });
        },

        findById: function(contactId, callback) {
        	Contact.findById(contactId)
	        	.select('firstname lastname phone')
	        	.exec(function(err, contact) {
	        		callback(err, contact);
	        	});
        },

        deleteAll: function () {
            Contact.remove({ }, function (err) {
            });
        }
    }
};
