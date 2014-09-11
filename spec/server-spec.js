var request = require('supertest');
var app = require('../app/server');
var ContactsProvider = require('../app/contacts-provider');
var contactsProvider = new ContactsProvider('mongodb://localhost/unicefcontactstest');

describe('Server API', function () {

    afterEach(function() {
        contactsProvider.deleteAll();
    });

    describe('GET /api ', function() {

      it('responds with json', function(done) {
        request(app)
          .get('/api')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect({ 'message': 'UNICEF contacts service API' })
          .expect(200, done);
      });
    });

    describe('GET /api/contacts ', function() {

      it('responds with all contacts as json', function(done) {
        var contacts = [{ firstname : "test", lastname : "user1", phone : "+254782443432" },
                        { firstname : "test", lastname : "user2", phone : "+254782443431" }];

        contactsProvider.addAll(contacts, function() {
            contactsProvider.findAll( function(err, allContacts) {
                request(app)
                  .get('/api/contacts')
                  .set('Accept', 'application/json')
                  .expect('Content-Type', /json/)
                  .expect([{ "_id" : allContacts[0]._id.toString(), "firstname" : "test", "lastname" : "user1", "phone" : "+254782443432" },
                          { "_id" : allContacts[1]._id.toString(), "firstname" : "test", "lastname" : "user2", "phone" : "+254782443431" }])
                  .expect(200, done);
            });
          });
        });
    });

    describe('POST /api/contacts/add ', function() {

      it('responds with all contacts as json', function(done) {
        var contact = { firstname : "test", lastname : "user1", phone : "+254782443432" };

        request(app)
          .post('/api/contacts/add')
          .send(contact)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(function(res) {
              expect(res.body.firstname).toEqual("test");
              expect(res.body.lastname).toEqual("user1");
              expect(res.body.phone).toEqual("+254782443432");
              expect(res.body._id).toBeDefined();
          })
          .expect(200, done);
        });
    });
});
