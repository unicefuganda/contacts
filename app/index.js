exports.counter  = function (first, second) {
  return first + second;
};

var connectDb = function() {
  var mongoose  = require('mongoose');
  mongoose.connect('mongodb://localhost/unicefcontacts');

  var db  = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));

  db.once('open', function callback () {
    var contactsSchema = mongoose.Schema({
      firstname: String,
      lastname: String,
      phone: String
    });

    var Contact = mongoose.model('Contact', contactsSchema);

    var districtContact = new Contact({ firstname: 'Peter',
                                        lastname: 'Omala',
                                        phone: '+256778645453'});

    districtContact.save(function (err, districtContact) {
      if (err) return console.error(err);
    });
  });
};
