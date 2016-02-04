var ContactsProvider = require('./contacts-provider');
var contactsProvider = new ContactsProvider();
var PhoneValidator = require('./phone-validator');
var BusinessError = require('./errors/business-error');

module.exports = function () {
    function formatPhoneNumber(phoneNumber, callback) {
        var phoneValidator = new PhoneValidator(phoneNumber);
        phoneValidator.format(function (err, formattedNumber) {
            callback(err, formattedNumber);
        });
    }

    return {
        find: function (req, res) {
            if (req.query.createdbyuserid == '' || req.query.searchfield == '') {
                throw new BusinessError(400, 'No searchfield or createdbyuserid query-string given')
            }

            contactsProvider.findExtended(req.query.createdbyuserid, req.query.searchfield,
                function (err, contacts) {
                    res.json(contacts);
                }
            );
        },

        findById: function (req, res) {
            var contactId = req.param('id');
            contactsProvider.findById(contactId, function (err, contact) {
                if (err || contact == null) {
                    throw new BusinessError(404, 'Contact not found')
                }

                res.json(contact);
            });
        },

        add: function (req, res) {
            formatPhoneNumber(req.param('phone'), function (err, formattedNumber) {
                if (err) {
                    throw new BusinessError(400, err.error);
                }

                contactsProvider.findExtended(undefined, formattedNumber, function (err, contacts) {
                    if (contacts.length) {
                        return res.status(400).json({error: "Contact with this phone number already exists"});
                    }

                    var contactDetails = {
                        firstName: req.param('firstName'),
                        lastName: req.param('lastName'),
                        phone: formattedNumber,
                        createdByUserId: req.param('createdByUserId'),
                        district: req.param('district'),
                        ips: req.param('ips')
                    };

                    contactsProvider.add(contactDetails, function (err, contact) {
                        if (err) {
                            throw new BusinessError(400, err.toString());
                        }
                        res.json({
                            _id: contact._id.toString(),
                            firstName: contact.firstName,
                            lastName: contact.lastName,
                            phone: contact.phone,
                            createdByUserId: contact.createdByUserId,
                            district: contact.district,
                            ips: contact.ips
                        });
                    });
                });
            });
        },

        edit: function (req, res) {

            var phoneNumber = req.param('phone');
            formatPhoneNumber(phoneNumber, function (err, formattedNumber) {
                if (err) {
                    throw new BusinessError(400, err.error);
                }

                contactsProvider.edit(req.param('_id'), {
                        firstName: req.param('firstName'),
                        lastName: req.param('lastName'),
                        phone: formattedNumber,
                        district: req.param('district'),
                        ips: req.param('ips')
                    },
                    function (err, contact) {
                        res.json({
                            _id: contact._id.toString(),
                            firstName: contact.firstName,
                            lastName: contact.lastName,
                            phone: contact.phone,
                            district: contact.district,
                            ips: contact.ips
                        });
                    });
            });
        },

        delete: function (req, res) {
            var id = req.param('id');

            if (id == null || id == '') {
                throw new BusinessError(404, 'Contact does not exist')
            }

            contactsProvider.delete(id, function () {
                res.json({message: 'Contact deleted'});
            });
        },

        welcomeMessage: function (req, res) {
            res.json({message: 'UNICEF contacts service API'});
        }
    }
};
