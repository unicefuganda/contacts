var ContactsProvider = require('../app/contacts-provider');
var contactsProvider = new ContactsProvider();
var PhoneValidator = require('../app/phone-validator');

module.exports = function () {

    function formatPhoneNumber(phoneNumber, callback) {
        var phoneValidator = new PhoneValidator(phoneNumber);
        phoneValidator.format(function (err, formattedNumber) {
            callback(err, formattedNumber);
        });
    }

    return {

        find: function (req, res) {
            if ((req.query.createdbyuserid == undefined || req.query.createdbyuserid != '') &&
                (req.query.searchfield == undefined || req.query.searchfield != '')) {
                contactsProvider.findExtended(req.query.createdbyuserid, req.query.searchfield, function (err, contacts) {
                    res.json(contacts);
                });
            }
            else {
                return res.status(400).json({error: 'No searchfield or createdbyuserid query-string given'});
            }
        },

        findById: function (req, res) {
            var contactId = req.param('id');
            contactsProvider.findById(contactId, function (err, contact) {
                if (err || contact == null) return res.status(404).json({error: 'Contact not found'});

                res.json(contact);
            });
        },

        add: function (req, res) {
            var createdByUserId = req.param('createdByUserId');
            if (!createdByUserId) {
                return res.status(400).json({error: 'Param createdByUserId is missing'});
            }

            var phoneNumber = req.param('phone');
            formatPhoneNumber(phoneNumber, function (err, formattedNumber) {
                if (err) return res.status(400).json(err);

                contactsProvider.findExtended(undefined, formattedNumber, function (err, contacts) {
                    if (contacts.length) {
                        return res.status(400).json({error: "Contact with this phone number already exists"});
                    }

                    var contactDetails = {
                        firstName: req.param('firstName'),
                        lastName: req.param('lastName'),
                        phone: formattedNumber,
                        createdByUserId: createdByUserId
                    };

                    contactsProvider.add(contactDetails, function (err, contact) {
                        res.json({
                            _id: contact._id.toString(), firstName: contact.firstName,
                            lastName: contact.lastName, phone: contact.phone, createdByUserId: contact.createdByUserId
                        });
                    });
                });

            });
        },

        edit: function (req, res) {

            var phoneNumber = req.param('phone');
            formatPhoneNumber(phoneNumber, function (err, formattedNumber) {
                if (err) return res.status(400).json(err);

                contactsProvider.edit(req.param('_id'), {
                        firstName: req.param('firstName'),
                        lastName: req.param('lastName'),
                        phone: formattedNumber
                    },
                    function (err, contact) {
                        res.json({
                            _id: contact._id.toString(),
                            firstName: contact.firstName,
                            lastName: contact.lastName,
                            phone: contact.phone
                        });
                    });
            });
        },

        delete: function (req, res) {
            var id = req.param('id');

            if (id == null || id == '') return res.status(404).json({error: 'Contact does not exist'});

            contactsProvider.delete(id, function () {
                res.json({message: 'Contact deleted'});
            });
        },

        welcomeMessage: function (req, res) {
            res.json({message: 'UNICEF contacts service API'});
        }
    }
};
