var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var router = express.Router();
var port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


router.get('/', function(req, res) {
  res.json({ message: 'hooray! welcome to our api!' });
});

app.use('/api', router);
app.listen(port);

console.log('Contacts service running ' + port);
