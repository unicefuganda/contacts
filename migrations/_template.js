module.exports = {
  requiresDowntime: false,
  up: function(callback) {
    return callback();
  },
  test: function() {
    return describe('up', function() {
      before(function() {});
      after(function() {});
      return it('works');
    });
  }
};
