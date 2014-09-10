var ContactProvider = require('../app/contact-provider');
var contactProvider = new ContactProvider('mongodb://localhost/unicefcontactstest');

describe("ContactProvider", function () {

    // REFACTOR: there must be a better way to do this
    afterEach(function() {
        contactProvider.deleteAll();
    });

    it("should add a new contact", function(done) {
      contactProvider.add( { firstname : "test", lastname : "user1", phone : "+254782443432" }, function(err, newContact) {
          expect(newContact.firstname).toBe("test");
          expect(newContact._id).toBeDefined();
          expect(newContact.createdOn).toBeDefined();
          done();
      });
    });

    it("should find all contacts", function(done) {
      contacts = [{ firstname : "test", lastname : "user1", phone : "+254782443432" },
                  { firstname : "test", lastname : "user2", phone : "+254782443431" }];

      contactProvider.addAll(contacts, function() {
        contactProvider.findAll(function(err, contacts) {
          expect(contacts.length).toBe(2);
          done();
        });
      });
    });

    it("should find contacts by name", function(done) {
      contacts = [{ firstname : "test", lastname : "user1", phone : "+254782443432" },
                  { firstname : "test1", lastname : "user2", phone : "+254782443431" }];

      contactProvider.addAll(contacts, function() {
        contactProvider.find( { firstname: 'test1' }, function(err, contacts) {
          expect(contacts.length).toBe(1);
          done();
        });
      });
    });

    it("should find contacts by phone number", function(done) {
      contacts = [{ firstname : "test", lastname : "user1", phone : "+254782443432" },
                  { firstname : "test1", lastname : "user2", phone : "+25477555555" }];

      contactProvider.addAll(contacts, function() {
        contactProvider.find( { phone : "+25477555555" }, function(err, contacts) {
          expect(contacts.length).toBe(1);
          done();
        });
      });
    });
});
