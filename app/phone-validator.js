var phoneLib = require('node-phonenumber');

module.exports = function (phoneNumber) {
    var parsedPhoneNumber;
    var phoneUtil = phoneLib.PhoneNumberUtil.getInstance();

    var isValid = function () {
        try {
            parsedPhoneNumber = phoneUtil.parse(phoneNumber);
            return phoneUtil.isValidNumber(parsedPhoneNumber);
        }
        catch(ex) {
            return false;
        }
    };

    return {

        format: function (callback) {
            if (!isValid()) return callback({ error: 'Phone number format is wrong' });
            return callback(null, phoneUtil.format(parsedPhoneNumber, phoneLib.PhoneNumberFormat.INTERNATIONAL));
        }
    }
};
