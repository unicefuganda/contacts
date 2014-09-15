var PhoneValidator = require('../app/phone-validator');

describe('phoneValidator', function() {

  describe('isValid', function() {

    it('is NOT valid for phone number without country code', function(done) {
      var phoneValidator = new PhoneValidator('0779500795');
      expect(phoneValidator.isValid()).toBe(false);
      done();
    });

    it('is NOT valid for phone number with country code but FEWER digits in the wrong format', function(done) {
      var phoneValidator = new PhoneValidator('+25677950079');
      expect(phoneValidator.isValid()).toBe(false);
      done();
    });

    it('is valid for phone number with country code and right number of digits', function(done) {
      var phoneValidator = new PhoneValidator('+256779500795');
      expect(phoneValidator.isValid()).toBe(true);
      done();
    });
  });

  describe('formats phone Number basing on accepted International format', function() {
    it('formats VALID phone number according to international format', function(done) {
      var phoneValidator = new PhoneValidator('+256779500795');
      phoneValidator.format(function(err, formattedNumber) {
        expect(err).toBe(null);
        expect(formattedNumber).toBe('+256 779 500795');
        done();
      });
    });

    it('does NOT formats and INVALID phone number', function(done) {
      var phoneValidator = new PhoneValidator('+25677950079');
      phoneValidator.format(function(err, formattedNumber) {
        expect(err).toEqual({ error : 'Phone number format is wrong' });
        expect(formattedNumber).not.toBeDefined();
        done();
      });
    });
  });
});
