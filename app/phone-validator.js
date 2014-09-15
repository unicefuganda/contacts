var phoneLib = require('node-phonenumber');

var PhoneValidator = function(phoneNumber) {
    this.phoneNumber = phoneNumber;
    this.phoneUtil = phoneLib.PhoneNumberUtil.getInstance();
};

PhoneValidator.prototype.isValid = function() {
    try {
        this.parsedPhoneNumber = this.phoneUtil.parse(this.phoneNumber);
        return this.phoneUtil.isValidNumber(this.parsedPhoneNumber);
    }
    catch(formatException) {
        return false;
    }
};

PhoneValidator.prototype.format = function(callback) {
    if (!this.isValid()) return callback({ error : 'Phone number format is wrong' });

    return callback(null, this.phoneUtil.format(this.parsedPhoneNumber, phoneLib.PhoneNumberFormat.INTERNATIONAL));
};

module.exports = PhoneValidator;

