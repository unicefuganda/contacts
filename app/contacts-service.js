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

        find: function(req, res) {
            if (req.query.searchfield == undefined || req.query.searchfield == '')
                return res.status(400).json({ error : 'No searchfield querystring given' });

            contactsProvider.find(req.query.searchfield, function(err, contacts) {
                res.json(contacts);
            });
        },

        add: function (req, res) {
            var phoneNumber = req.param('phone');

            formatPhoneNumber(phoneNumber, function (err, formattedNumber) {
                if (err) return res.status(400).json(err);

                contactsProvider.add({ firstname: req.param('firstname'), lastname: req.param('lastname'), phone: formattedNumber},
                    function (err, contact) {
                        res.json({ _id: contact._id.toString(), firstname: contact.firstname, lastname: contact.lastname, phone: contact.phone });
                    });
            });
        },

        edit: function (req, res) {
            var phoneNumber = req.param('phone');

            formatPhoneNumber(phoneNumber, function (err, formattedNumber) {
                if (err) return res.status(400).json(err);

                contactsProvider.edit(req.param('_id'), { firstname: req.param('firstname'), lastname: req.param('lastname'), phone: formattedNumber},
                    function (err, contact) {
                        res.json({ _id: contact._id.toString(), firstname: contact.firstname, lastname: contact.lastname, phone: contact.phone });
                    });
            });
        },

        welcomeMessage: function (req, res) {
            res.json({ message: 'UNICEF contacts service API' });
        }
    }
};
