var request = require('supertest');
var app = require('../app/server');
var ContactsProvider = require('../app/contacts-provider');
var contactsProvider = new ContactsProvider('mongodb://localhost/unicefcontactstest');

describe('Server API', function () {

    beforeEach(function () {
        contactsProvider.deleteAll();
    });

    describe('GET /api ', function () {

        it('responds with json', function (done) {
            request(app)
                .get('/api')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect({ 'message': 'UNICEF contacts service API' })
                .expect(200, done);
        });
    });

    describe('GET /api/contacts?searchfield="value"', function() {

      it('responds with an ERROR when "searchfield" querystring is NOT defined', function(done) {
        var contacts = [{ firstname : "test", lastname : "user1", phone : "+254 782 443432" },
                        { firstname : "test", lastname : "user12", phone : "+254 782 443431" }];

        contactsProvider.addAll(contacts, function() {
            request(app)
              .get('/api/contacts')
              .set('Accept', 'application/json')
              .expect('Content-Type', /json/)
              .expect({ error : 'No searchfield querystring given' })
              .expect(400, done);
          });
        });

      it('responds with an ERROR when "searchfield" querystring is defined but is EMPTY', function(done) {
        var contacts = [{ firstname : "test", lastname : "user1", phone : "+254 782 443432" },
                        { firstname : "test", lastname : "user12", phone : "+254 782 443431" }];

        contactsProvider.addAll(contacts, function() {
            request(app)
              .get('/api/contacts?searchfield')
              .set('Accept', 'application/json')
              .expect('Content-Type', /json/)
              .expect({ error : 'No searchfield querystring given' })
              .expect(400, done);
          });
        });

      it('responds with all matching contacts as json', function(done) {
        var contacts = [{ firstname : "test", lastname : "user1", phone : "+254 782 443432" },
                        { firstname : "test", lastname : "last1", phone : "+254 782 443492" },
                        { firstname : "test", lastname : "user12", phone : "+254 782 443431" }];

        contactsProvider.addAll(contacts, function() {
            contactsProvider.findAll(function(err, allContacts) {
                request(app)
                  .get('/api/contacts?searchfield=user')
                  .set('Accept', 'application/json')
                  .expect('Content-Type', /json/)
                  .expect([{ "_id" : allContacts[0]._id.toString(), "firstname" : "test", "lastname" : "user1", "phone" : "+254 782 443432" },
                          { "_id" : allContacts[2]._id.toString(), "firstname" : "test", "lastname" : "user12", "phone" : "+254 782 443431" }])
                  .expect(200, done);
            });
          });
        });
    });

    describe('GET /api/contacts/:id', function() {
      it('responds with an error when id given does nto match any contacts', function(done) {
        var contact = { firstname: "test", lastname: "user1", phone: "+256 782 443432" };

        contactsProvider.add(contact, function(err, addedContact) {
          request(app)
            .get('/api/contacts/' + "1")
            .expect('Content-Type', /json/)
            .expect({"error": "Contact not found"})
            .expect(404, done);
        });
      });

      it('gets a contact by id', function(done) {
        var contact = { firstname: "test", lastname: "user1", phone: "+256 782 443432" };
        contactsProvider.add(contact, function(err, addedContact) {
          request(app)
            .get('/api/contacts/' + addedContact._id)
            .expect('Content-Type', /json/)
            .expect({"_id" : addedContact._id.toString(), "firstname" : "test", "lastname" : "user1", "phone" : "+256 782 443432"})
            .expect(200, done);
        });
      });
    });

    describe('POST /api/contacts/ ', function () {

        it('responds with added contact as json', function (done) {
            var contact = { firstname: "test", lastname: "user1", phone: "+256 782 443432" };

            request(app)
                .post('/api/contacts/')
                .send(contact)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(function (res) {
                    expect(res.body.firstname).toEqual("test");
                    expect(res.body.lastname).toEqual("user1");
                    expect(res.body.phone).toEqual("+256 782 443432");
                    expect(res.body._id).toBeDefined();
                })
                .expect(200, done);
        });

        it('responds with an error message when phone number is in wrong format', function (done) {
            var contact = { firstname: "test", lastname: "user1", phone: "+256 782 44323" };

            request(app)
                .post('/api/contacts/')
                .send(contact)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(function (res) {
                    expect(res.body.error).toEqual("Phone number format is wrong");
                })
                .expect(400, done);
        });
    });

    describe('PUT /api/contacts/ ', function () {

        it('responds with edited contact as json if contact exists', function (done) {
            var contact = { firstname: "test", lastname: "user1", phone: "+254 782 443432" };

            contactsProvider.add(contact, function (err, addedContact) {
                var edited_contact = { _id: addedContact._id, firstname: "test_edit", lastname: "user1", phone: "+254701443432" };

                request(app)
                    .put('/api/contacts/')
                    .send(edited_contact)
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(function (res) {
                        expect(res.body.firstname).toEqual("test_edit");
                        expect(res.body.lastname).toEqual("user1");
                        expect(res.body.phone).toEqual("+254 701 443432");
                    })
                    .expect(200, done);
            });
        });

        it('responds with an error message when phone number is in wrong format', function (done) {
            var contact = { firstname: "test", lastname: "user1", phone: "+254 782 443432" };

            contactsProvider.add(contact, function (err, addedContact) {
                var edited_contact = { _id: addedContact._id, firstname: "test_edit", lastname: "user1", phone: "+25470143432" };

                request(app)
                    .put('/api/contacts/')
                    .send(edited_contact)
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(function (res) {
                        expect(res.body.error).toEqual("Phone number format is wrong");
                    })
                    .expect(400, done);
            });
        });
    });
});
