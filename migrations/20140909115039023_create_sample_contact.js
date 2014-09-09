module.exports = {
  requiresDowntime: false,
  up: function(afterUp) {
    return afterUp();
  },
  test: function() {
    return describe('up', function() {
      before(function() {});
      after(function() {});
      return it('works');
    });
  }
};

function afterUp() {

}
