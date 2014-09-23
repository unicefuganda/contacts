var ContactsProvider = require('../app/contacts-provider');
var contactsProvider = new ContactsProvider('mongodb://localhost/unicefcontactstest');

describe("ContactsProvider", function () {

    // REFACTOR: there must be a better way to do this
    beforeEach(function() {
        contactsProvider.deleteAll();
    });

    it("should add a new contact", function(done) {
      contactsProvider.add( { firstName : "test", lastName : "user1", phone : "+254782443432" }, function(err, newContact) {
          expect(newContact.firstName).toBe("test");
          expect(newContact._id).toBeDefined();
          expect(newContact.createdOn).toBeDefined();
          done();
      });
    });

    it("should edit an existing contact", function(done) {
      contactsProvider.add( { firstName : "test", lastName : "user1", phone : "+254782443432" }, function(err, addedContact) {
        contactsProvider.edit(addedContact._id, { firstName : "test_edit", lastName : "user1", phone : "+254782443432" }, function(err, editedContact) {
            expect(editedContact.firstName).toBe("test_edit");
            expect(editedContact.lastName).toBe("user1");
          done();
        });
      });
    });

    it("should find all contacts", function(done) {
      var contacts = [{ firstName : "test", lastName : "user1", phone : "+254782443432" },
                  { firstName : "test", lastName : "user2", phone : "+254782443431" }];

      contactsProvider.addAll(contacts, function() {
        contactsProvider.findAll(function(err, contacts) {
          expect(contacts.length).toBe(2);
          done();
        });
      });
    });

    it("should find contacts by firstName", function(done) {
      var contacts = [{ firstName : "test", lastName : "user1", phone : "+254 782 443432" },
                  { firstName : "test1", lastName : "user2", phone : "+254 782 443431" }];

      contactsProvider.addAll(contacts, function() {
        contactsProvider.find('Test', function(err, contacts) {
          expect(contacts.length).toBe(2);
          done();
        });
      });
    });

    it("should find contact by phone number", function(done) {
      var contacts = [{ firstName : "test", lastName : "user1", phone : "+254 782 443432" },
                  { firstName : "test1", lastName : "user2", phone : "+254 775 55555" }];

      contactsProvider.addAll(contacts, function() {
        contactsProvider.find("+254 775 55555", function(err, contact) {
          expect(contact[0].phone).toEqual("+254 775 55555");
          done();
        });
      });
    });

    it("should find contacts by lastName", function(done) {
      var contacts = [{ firstName : "test", lastName : "user1", phone : "+254 782 443432" },
                  { firstName : "test1", lastName : "user3", phone : "+254 782 422431" }];

      contactsProvider.addAll(contacts, function() {
        contactsProvider.find('Ser3' , function(err, contacts) {
          expect(contacts.length).toBe(1);
          done();
        });
      });
    });

    it("should find contact by id", function(done) {
      var contact = { firstName : "test", lastName : "user1", phone : "+254 782 443436" };

      contactsProvider.add(contact, function(err, addedContact) {
        contactsProvider.findById(addedContact._id , function(err, foundContact) {
          expect(foundContact._id).toEqual(addedContact._id);
          done();
        });
      });
    });


});
