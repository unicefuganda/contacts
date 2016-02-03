var _ = require('lodash');
var request = require('supertest');
var app = require('../app/server');
var ContactsProvider = require('../app/contacts-provider');
var contactsProvider = new ContactsProvider('mongodb://localhost/unicefcontactstest');

describe('Server API', function () {
    var contact_john = {
        firstName: "John",
        lastName: "Doe",
        phone: "+256782434331",
        district: "wakiso",
        ips: ["WAKISO DHO", "END USER"],
        createdByUserId: 5
    };
    var contact_jade = {
        firstName: "Jade",
        lastName: "Sam",
        phone: "+254782443432",
        district: "kampala",
        ips: ["KAMPALA DHO"],
        createdByUserId: 5
    };
    var contact_bill = {
        firstName: "Jade",
        lastName: "Bill",
        phone: "+254782453433",
        district: "kampala",
        ips: ["KAMPALA DHO"],
        createdByUserId: 6
    };
    var contacts = [contact_john, contact_jade, contact_bill];

    afterEach(function () {
        contactsProvider.deleteAll();
    });

    describe('GET /api ', function () {
        it('responds with json', function (done) {
            request(app)
                .get('/api')
                .set('Content-Type', 'application/json')
                .expect('Content-Type', /json/)
                .expect({'message': 'UNICEF contacts service API'})
                .expect(200, done);
        });
    });

    describe('GET /api/contacts[?createdbyuserid="value"&searchfield="value"]', function () {
        it('responds with an ERROR when "searchfield" querystring is defined but is EMPTY', function (done) {

            contactsProvider.addAll(contacts, function () {
                request(app)
                    .get('/api/contacts?searchfield')
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect({error: 'No searchfield or createdbyuserid query-string given'})
                    .expect(400, done);
            });
        });

        it('responds with an ERROR when "createdbyuserid" querystring is defined but is EMPTY', function (done) {
            contactsProvider.addAll(contacts, function () {
                request(app)
                    .get('/api/contacts?createdbyuserid')
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect({error: 'No searchfield or createdbyuserid query-string given'})
                    .expect(400, done);
            });
        });

        it('responds with all the contacts when "createdbyuserid" and "searchfield" querystring is NOT defined', function (done) {
            contactsProvider.addAll(contacts, function () {
                contactsProvider.findAll(function () {
                    request(app)
                        .get('/api/contacts')
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(function (response) {
                            expect(response.body.length).toEqual(3)
                        })
                        .expect(200, done);
                });
            });
        });

        it('responds with all matching contacts as json', function (done) {
            var contacts = [contact_john, contact_jade, contact_bill];
            contactsProvider.addAll(contacts, function () {
                contactsProvider.findAll(function () {
                    request(app)
                        .get('/api/contacts?searchfield=Jade')
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(function (response) {
                            expect(response.body.length).toEqual(2)
                        })
                        .expect(200, done);
                });
            });
        });

        it('responds with all matching contacts as per full name', function (done) {
            contactsProvider.addAll(contacts, function () {
                contactsProvider.findAll(function () {
                    request(app)
                        .get('/api/contacts?searchfield=John Doe')
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(function (response) {
                            expect(response.body.length).toEqual(1)
                        })
                        .expect(200, done);
                });
            });
        });

        it('responds with IPs contacts when "createdbyuserid" is defined and "searchfield" NOT defined in querystring', function (done) {
            contactsProvider.addAll(contacts, function () {
                contactsProvider.findAll(function () {
                    request(app)
                        .get('/api/contacts?createdbyuserid=5')
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(function (response) {
                            expect(response.body.length).toEqual(2)
                        })
                        .expect(200, done);
                });
            });
        });

        it('responds with IPs matching contacts as json', function (done) {
            contactsProvider.addAll(contacts, function () {
                contactsProvider.findAll(function () {
                    request(app)
                        .get('/api/contacts?createdbyuserid=5&searchfield=John')
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(function (response) {
                            expect(response.body.length).toEqual(1)
                        })
                        .expect(200, done);
                });
            });
        });
    });

    describe('GET /api/contacts/:id', function () {
        it('responds with an error when given id does not match any contacts', function (done) {
            contactsProvider.add(contact_jade, function () {
                request(app)
                    .get('/api/contacts/' + "100")
                    .expect('Content-Type', /json/)
                    .expect({"error": "Contact not found"})
                    .expect(404, done);
            });
        });

        it('gets a contact by id', function (done) {
            contactsProvider.add(contact_john, function (err, addedContact) {
                request(app)
                    .get('/api/contacts/' + addedContact._id)
                    .expect('Content-Type', /json/)
                    .expect({
                        _id: addedContact._id.toString(),
                        firstName: contact_john.firstName,
                        lastName: contact_john.lastName,
                        phone: contact_john.phone,
                        district: contact_john.district,
                        ips: contact_john.ips
                    })
                    .expect(200, done);
            });
        });
    });

    describe('POST /api/contacts/ ', function () {

        it('responds with added contact as json', function (done) {
            request(app)
                .post('/api/contacts/')
                .send(contact_john)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(function (res) {
                    expect(res.body.firstName).toEqual(contact_john.firstName);
                    expect(res.body.lastName).toEqual(contact_john.lastName);
                    expect(res.body.phone).toEqual(contact_john.phone);
                    expect(res.body.createdByUserId).toEqual(5);
                    expect(res.body._id).toBeDefined();
                })
                .expect(200, done);
        });

        it('responds with an error message when phone number is in wrong format', function (done) {
            var contact_with_wrong_phone_number = _.clone(contact_john);
            contact_with_wrong_phone_number.phone = '0779500795';
            request(app)
                .post('/api/contacts/')
                .send(contact_with_wrong_phone_number)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(function (res) {
                    expect(res.body.error).toEqual("Phone number format is wrong");
                })
                .expect(400, done);
        });

        it('responds with an error message when a contact with the same phone number exists', function (done) {
            contactsProvider.add(contact_john, function () {
                request(app)
                    .post('/api/contacts/')
                    .send(contact_john)
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(function (res) {
                        expect(res.body.error).toEqual("Contact with this phone number already exists");
                    })
                    .expect(400, done);
            });
        });

        it('responds with an error message when createdByUserId param is not defined', function (done) {
            var incorrect_contact = _.omit(contact_john, 'createdByUserId')
            request(app)
                .post('/api/contacts/')
                .send(incorrect_contact)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(function (res) {
                    expect(res.body.error).toEqual("Param createdByUserId is missing");
                })
                .expect(400, done);
        });
    });

    describe('PUT /api/contacts/ ', function () {
        it('responds with edited contact as json if contact exists', function (done) {
            contactsProvider.add(contact_john, function (err, addedContact) {
                var edited_contact = {
                    _id: addedContact._id,
                    firstName: "Jack",
                    lastName: "Bob",
                    phone: "+254701443432",
                    district: "kampala",
                    ips: ["KAMPALA DHO", "END USER"]
                };

                request(app)
                    .put('/api/contacts/')
                    .send(edited_contact)
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(function (res) {
                        expect(res.body.firstName).toEqual("Jack");
                        expect(res.body.lastName).toEqual("Bob");
                        expect(res.body.phone).toEqual("+254701443432");
                        expect(res.body.district).toEqual("kampala");
                        expect(isArrayEqual(res.body.ips, ["KAMPALA DHO", "END USER"])).toBeTruthy();
                    })
                    .expect(200, done);
            });
        });

        it('responds with an error message when phone number is in wrong format', function (done) {
            contactsProvider.add(contact_john, function (err, addedContact) {
                var edited_contact = {
                    _id: addedContact._id,
                    firstName: "Jack",
                    lastName: "Bob",
                    phone: "0779500795",
                    district: "kampala",
                    ips: ["KAMPALA DHO", "END USER"]
                };

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

        it('responds with unchanged "createdByUserId" even the filed is specified in editing', function (done) {
            contactsProvider.add(contact_john, function (err, addedContact) {
                var edited_contact = {
                    _id: addedContact._id,
                    firstName: "Jack",
                    lastName: "Bob",
                    phone: "+254701443432",
                    district: "kampala",
                    ips: ["KAMPALA DHO", "END USER"]
                };

                request(app)
                    .put('/api/contacts/')
                    .send(edited_contact)
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(function (res) {
                        expect(res.body.firstName).toEqual("Jack");
                        expect(res.body.lastName).toEqual("Bob");
                        expect(res.body.phone).toEqual("+254701443432");
                        expect(res.body.district).toEqual("kampala");
                        expect(isArrayEqual(res.body.ips, ["KAMPALA DHO", "END USER"])).toBeTruthy();
                    })
                    .expect(200, done);
            });
        });
    });

    describe('DELETE /api/contacts/', function () {

        it('deletes the contact with a particular _id', function (done) {
            contactsProvider.addAll(contacts, function () {
                contactsProvider.findAll(function (err, foundContacts) {
                    var contactId = foundContacts[0]._id;

                    request(app)
                        .delete('/api/contacts/' + contactId)
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(function (res) {
                            expect(res.body.message).toEqual("Contact deleted");
                        })
                        .expect(200, done);
                });
            });
        });
    });

    var isArrayEqual = function (actual_array, expected_array) {
        return actual_array.toString() === expected_array.toString();
    }
});
