var PhoneValidator = require('../app/phone-validator');

describe('phoneValidator', function () {
    describe('formats phone Number', function () {

        it('formats VALID phone number and removes white spaces', function (done) {
            var phoneValidator = new PhoneValidator('+256773090348');
            phoneValidator.format(function (err, formattedNumber) {
                expect(err).toBe(null);
                expect(formattedNumber).toBe('+256773090348');
                done();
            });
        });

        it('does NOT format phone number without country code', function (done) {
            var phoneValidator = new PhoneValidator('0779500795');
            phoneValidator.format(function (err, formattedNumber) {
                expect(err).toEqual({ error: 'Phone number format is wrong' });
                expect(formattedNumber).not.toBeDefined();
                done();
            });
        });

        it('does NOT format an INVALID phone number', function (done) {
            var phoneValidator = new PhoneValidator('+25677950079');
            phoneValidator.format(function (err, formattedNumber) {
                expect(err).toEqual({ error: 'Phone number format is wrong' });
                expect(formattedNumber).not.toBeDefined();
                done();
            });
        });
    });
});
