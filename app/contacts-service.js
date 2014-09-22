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
            if (req.query.searchfield == undefined || req.query.searchfield == '')
                return res.status(400).json({ error: 'No searchfield querystring given' });

            contactsProvider.find(req.query.searchfield, function (err, contacts) {
                res.json(contacts);
            });
        },

        findById: function (req, res) {
            var contactId = req.param('id');
            contactsProvider.findById(contactId, function (err, contact) {
                if (err || contact == null) return res.status(404).json({error: 'Contact not found'});

                res.json(contact);
            });
        },

        add: function (req, res) {
            var phoneNumber = req.param('phone');
            formatPhoneNumber(phoneNumber, function (err, formattedNumber) {
                if (err) return res.status(400).json(err);

                contactsProvider.find(formattedNumber, function (err, contacts) {
                    if (contacts.length) {
                        return res.status(400).json({error: "Contact with this phone number already exists"});
                    }

                    var contactDetails = {firstName: req.param('firstName'), lastName: req.param('lastName'), phone: formattedNumber};

                    contactsProvider.add(contactDetails, function (err, contact) {
                        res.json({
                            _id: contact._id.toString(), firstName: contact.firstName,
                            lastName: contact.lastName, phone: contact.phone
                        });
                    });
                });

            });
        },

        edit: function (req, res) {
            var phoneNumber = req.param('phone');
            formatPhoneNumber(phoneNumber, function (err, formattedNumber) {
                if (err) return res.status(400).json(err);

                contactsProvider.edit(req.param('_id'), { firstName: req.param('firstName'), lastName: req.param('lastName'), phone: formattedNumber},
                    function (err, contact) {
                        res.json({ _id: contact._id.toString(), firstName: contact.firstName, lastName: contact.lastName, phone: contact.phone });
                    });
            });
        },

        welcomeMessage: function (req, res) {
            res.json({ message: 'UNICEF contacts service API' });
        }
    }
};
