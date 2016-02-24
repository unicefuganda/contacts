var _ = require('lodash');
var request = require('supertest');
var Utils = require('./utils');
var app = require('../app/server');
var ContactsProvider = require('../app/contacts-provider');

var isArrayEqual = new Utils().isArrayEqual;
var contactsProvider = new ContactsProvider('mongodb://localhost/unicefcontactstest');

describe('Server API', function () {
    var contact_john, contact_jade, contact_bill, contacts;

    beforeEach(function () {
        contact_john = {
            firstName: "John",
            lastName: "Doe",
            phone: "+256782434331",
            districts: ["Wakiso"],
            ips: ["KAMPALA DHO", "WAKISO DHO"],
            types: ['End-user'],
            outcomes: ["YI101 - PCR 1 KEEP CHILDREN LEARNING"],
            createdByUserId: 5,
            createdByUserGroup: "UNICEF"

        };
        contact_jade = {
            firstName: "Jade",
            lastName: "Sam",
            phone: "+254782443432",
            districts: ["Kampala"],
            ips: ["KAMPALA DHO"],
            types: ['End-user'],
            outcomes: ["YI101 - PCR 1 KEEP CHILDREN LEARNING"],
            createdByUserGroup: "UNICEF",
            createdByUserId: 5
        };
        contact_bill = {
            firstName: "Jade",
            lastName: "Bill",
            phone: "+254782453433",
            districts: ["Kampala"],
            ips: ["KAMPALA DHO"],
            types: ['Sub-consignee'],
            outcomes: ["YI101 - PCR 1 KEEP CHILDREN LEARNING"],
            createdByUserGroup: "UNICEF",
            createdByUserId: 6
        };
        contacts = [contact_john, contact_jade, contact_bill];
    });

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
                            expect(response.body.length).toEqual(2);
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
                            expect(response.body.length).toEqual(1);
                            var firstContact = response.body[0];
                            expect(firstContact.firstName).toEqual(contact_john.firstName);
                            expect(firstContact.lastName).toEqual(contact_john.lastName);
                            expect(firstContact.phone).toEqual(contact_john.phone);
                            expect(isArrayEqual(firstContact.districts, contact_john.districts)).toBeTruthy();
                            expect(isArrayEqual(firstContact.ips, contact_john.ips)).toBeTruthy();
                            expect(isArrayEqual(firstContact.types, contact_john.types)).toBeTruthy();
                            expect(isArrayEqual(firstContact.outcomes, contact_john.outcomes)).toBeTruthy();
                            expect(firstContact.createdOn).toBeDefined();
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
                    .expect(function (res) {
                        expect(res.body._id).toEqual(addedContact._id.toString());
                        expect(res.body.firstName).toEqual(contact_john.firstName);
                        expect(res.body.lastName).toEqual(contact_john.lastName);
                        expect(res.body.phone).toEqual(contact_john.phone);
                        expect(isArrayEqual(res.body.districts, contact_john.districts)).toBeTruthy();
                        expect(isArrayEqual(res.body.ips, contact_john.ips)).toBeTruthy();
                        expect(isArrayEqual(res.body.types, contact_john.types)).toBeTruthy();
                        expect(isArrayEqual(res.body.outcomes, contact_john.outcomes)).toBeTruthy();
                        expect(res.body.createdOn).toBeDefined();
                    })
                    .expect(200, done);
            });
        });
    });

    describe('POST /api/contacts/ ', function () {
        it('responds with added contact which only contains basic info', function (done) {
            var contact = {
                firstName: "John",
                lastName: "Doe",
                phone: "+256782434331",
                districts: [],
                ips: [],
                types: [],
                outcomes: [],
                createdByUserId: 5,
                createdByUserGroup: "UNICEF"
            };
            request(app)
                .post('/api/contacts/')
                .send(contact)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(function (res) {
                    expect(res.body.firstName).toEqual(contact.firstName);
                    expect(res.body.lastName).toEqual(contact.lastName);
                    expect(res.body.phone).toEqual(contact.phone);
                    expect(res.body.createdByUserId).toEqual(5);
                    expect(res.body._id).toBeDefined();
                })
                .expect(200, done);
        });

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
                    expect(isArrayEqual(res.body.districts, contact_john.districts)).toBeTruthy();
                    expect(isArrayEqual(res.body.ips, contact_john.ips)).toBeTruthy();
                    expect(isArrayEqual(res.body.types, contact_john.types)).toBeTruthy();
                    expect(isArrayEqual(res.body.outcomes, contact_john.outcomes)).toBeTruthy();
                    expect(res.body.createdOn).toBeDefined();
                })
                .expect(200, done);
        });

        it('responds with an error message when phone number is in wrong format', function (done) {
            contact_john.phone = '0779500795';
            request(app)
                .post('/api/contacts/')
                .send(contact_john)
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
            var incorrect_contact = _.omit(contact_john, 'createdByUserId');
            request(app)
                .post('/api/contacts/')
                .send(incorrect_contact)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(function (res) {
                    expect(res.body.error).toEqual("ValidationError: Path `createdByUserId` is required.");
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
                    districts: ["Kampala"],
                    ips: ["KAMPALA DHO", "WAKISO DHO"],
                    types: ["End-user"],
                    outcomes: ["YI105 - PCR 1 KEEP CHILDREN AND MOTHERS"]
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
                        expect(isArrayEqual(res.body.districts, edited_contact.districts)).toBeTruthy();
                        expect(isArrayEqual(res.body.ips, edited_contact.ips)).toBeTruthy();
                        expect(isArrayEqual(res.body.types, edited_contact.types)).toBeTruthy();
                        expect(isArrayEqual(res.body.outcomes, edited_contact.outcomes)).toBeTruthy();
                        expect(res.body.createdOn).toBeDefined();
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
                    districts: "Kampala",
                    ips: ["KAMPALA DHO", "WAKISO DHO"]
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
                    districts: ["Kampala"],
                    ips: ["KAMPALA DHO", "WAKISO DHO"],
                    types: ['Sub-consignee'],
                    outcomes: ["YI101 - PCR 1 KEEP CHILDREN LEARNING"],
                };

                request(app)
                    .put('/api/contacts/')
                    .send(edited_contact)
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(function (res) {
                        expect(res.body.firstName).toEqual(edited_contact.firstName);
                        expect(res.body.lastName).toEqual(edited_contact.lastName);
                        expect(res.body.phone).toEqual(edited_contact.phone);
                        expect(isArrayEqual(res.body.districts, edited_contact.districts)).toBeTruthy();
                        expect(isArrayEqual(res.body.ips, edited_contact.ips)).toBeTruthy();
                        expect(isArrayEqual(res.body.types, edited_contact.types)).toBeTruthy();
                        expect(isArrayEqual(res.body.outcomes, edited_contact.outcomes)).toBeTruthy();
                        expect(res.body.createdOn).toBeDefined();
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
});
