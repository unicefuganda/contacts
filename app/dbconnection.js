var mongoose = require('mongoose');

var DbConnection = function() { };

DbConnection.schema = mongoose.Schema({ firstname: String,
                                          lastname: String,
                                          phone: { type: String, unique: true },
                                          createdOn: { type: Date, 'default': Date.now },
                                          updatedOn: Date });

DbConnection.save = function(mongodbUrl, contactDetails) {

  //e.g. mongodb://localhost/unicefcontacts'
  mongoose.connect(mongodbUrl);
  var db  = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function callback () {
    var Contact = mongoose.model('Contact', DbConnection.schema);
    var contact = new Contact(contactDetails);
    contact.save(function (err, contact) {
      if (err) return console.error(err);
    });
  });
};

module.exports = DbConnection;
