var phoneLib = require('node-phonenumber');

module.exports = function (phoneNumber) {
    var parsedPhoneNumber;
    var phoneUtil = phoneLib.PhoneNumberUtil.getInstance();

    return {
        isValid: function () {
            try {
                parsedPhoneNumber = phoneUtil.parse(phoneNumber);
                return phoneUtil.isValidNumber(parsedPhoneNumber);
            }
            catch (formatException) {
                return false;
            }
        },
        format: function (callback) {
            if (!this.isValid()) return callback({ error: 'Phone number format is wrong' });
            return callback(null, phoneUtil.format(parsedPhoneNumber, phoneLib.PhoneNumberFormat.INTERNATIONAL));
        }
    }
};
