var _ = require('lodash');
var Utils = require('./utils');
var ContactsProvider = require('../app/contacts-provider');

var isArrayEqual = new Utils().isArrayEqual;
var contactsProvider = new ContactsProvider('mongodb://localhost/unicefcontactstest');

describe("ContactsProvider", function () {
    var contact_john, contact_jade, contacts;

    beforeEach(function () {
        contact_john = {
            firstName: "John",
            lastName: "Doe",
            phone: "+254782443432",
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
            phone: "+254782443431",
            districts: ["Kampala"],
            ips: ["KAMPALA DHO"],
            types: ['Sub-consignee'],
            outcomes: ["YI105 - PCR 1 KEEP CHILDREN AND MOTHERS"],
            createdByUserId: 5,
            createdByUserGroup: "IP"
        };
        contacts = [contact_john, contact_jade];
    });

    beforeEach(function () {
        contactsProvider.deleteAll();
    });

    it("should add a new contact", function (done) {
        contactsProvider.add(contact_john, function (err, newContact) {
            expect(newContact._id).toBeDefined();
            expect(newContact.firstName).toBe(contact_john.firstName);
            expect(newContact.lastName).toBe(contact_john.lastName);
            expect(newContact.phone).toBe(contact_john.phone);
            expect(newContact.createdByUserGroup).toBe(contact_john.createdByUserGroup);
            expect(newContact.createdOn).toBeDefined();
            expect(isArrayEqual(newContact.districts, contact_john.districts)).toBeTruthy();
            expect(isArrayEqual(newContact.types, contact_john.types)).toBeTruthy();
            expect(isArrayEqual(newContact.outcomes, contact_john.outcomes)).toBeTruthy();
            expect(isArrayEqual(newContact.ips, contact_john.ips)).toBeTruthy();
            done();
        });
    });

    it("should edit an existing contact", function (done) {
        contactsProvider.add(contact_john, function (err, addedContact) {
            contactsProvider.edit(addedContact._id, {
                firstName: "Jack",
                lastName: "Doe",
                phone: "+254782443432",
                districts: "Kampala",
                types: ['UPDATE END USER'],
                outcomes: ['YI101 - PCR 1 KEEP CHILDREN LEARNING'],
                ips: ["UPDATE WAKISO DHO"]
            }, function (err, editedContact) {
                expect(editedContact.firstName).toBe("Jack");
                expect(editedContact.lastName).toBe("Doe");
                expect(isArrayEqual(editedContact.districts, ["Kampala"])).toBeTruthy();
                expect(isArrayEqual(editedContact.types, ["UPDATE END USER"])).toBeTruthy();
                expect(isArrayEqual(editedContact.outcomes, ["YI101 - PCR 1 KEEP CHILDREN LEARNING"])).toBeTruthy();
                expect(isArrayEqual(editedContact.ips, ["UPDATE WAKISO DHO"])).toBeTruthy();
                done();
            });
        });
    });

    it("should find all contacts", function (done) {
        contactsProvider.addAll(contacts, function () {
            contactsProvider.findAll(function (err, contacts) {
                expect(contacts.length).toBe(2);
                done();
            });
        });
    });

    it("should order all contacts by firstName then lastName", function (done) {
        contactsProvider.addAll(contacts, function () {
            contactsProvider.findAll(function (err, contacts) {
                expect(contacts.toString()).toContain(contact_john.lastName);
                expect(contacts.toString()).toContain(contact_jade.lastName);
                done();
            });
        });
    });

    it("should find contacts by firstName", function (done) {
        contactsProvider.addAll(contacts, function () {
            contactsProvider.find(contact_jade.firstName, function (err, contacts) {
                expect(contacts.length).toBe(1);
                done();
            });
        });
    });

    it("should find contact by phone number", function (done) {
        contactsProvider.addAll(contacts, function () {
            contactsProvider.find(contact_jade.phone, function (err, contact) {
                expect(contact[0].phone).toEqual(contact_jade.phone);
                done();
            });
        });
    });

    it("should order by firstName then lastName", function (done) {
        var contact_bill = {
            firstName: "Jade",
            lastName: "Bill",
            phone: "+254782453431",
            districts: ["Kampala"],
            ips: ["KAMPALA DHO"],
            types: ['Sub-consignee'],
            outcomes: ["YI105 - PCR 1 KEEP CHILDREN AND MOTHERS"],
            createdByUserId: 5,
            createdByUserGroup: 'IP'
        };
        var contacts = [contact_john, contact_jade, contact_bill];

        contactsProvider.addAll(contacts, function () {
            contactsProvider.find("Jade", function (err, contacts) {
                expect(contacts.toString()).toContain(contact_bill.lastName);
                expect(contacts.toString()).toContain(contact_jade.lastName);
                expect(contacts.length).toBe(2);
                done();
            });
        });
    });

    it("should find contacts by lastName", function (done) {
        contactsProvider.addAll(contacts, function () {
            contactsProvider.find(contact_jade.lastName, function (err, contacts) {
                expect(contacts.length).toBe(1);
                expect(contacts[0].lastName).toBe(contact_jade.lastName)
                done();
            });
        });
    });

    it("should find contact by id", function (done) {
        contactsProvider.add(contact_jade, function (err, addedContact) {
            contactsProvider.findById(addedContact._id, function (err, foundContact) {
                expect(foundContact._id).toEqual(addedContact._id);
                expect(foundContact.firstName).toEqual(addedContact.firstName);
                expect(foundContact.lastName).toEqual(addedContact.lastName);
                expect(foundContact.createdByUserGroup).toEqual(addedContact.createdByUserGroup);

                expect(isArrayEqual(foundContact.districts, addedContact.districts)).toBeTruthy();
                expect(isArrayEqual(foundContact.types, addedContact.types)).toBeTruthy();
                expect(isArrayEqual(foundContact.outcomes, addedContact.outcomes)).toBeTruthy();
                expect(isArrayEqual(foundContact.ips, addedContact.ips)).toBeTruthy()
                done();
            });
        });
    });

    it("should find contacts by districts", function (done) {
        contactsProvider.add(contact_jade, function (err, addedContact) {
            contactsProvider.find(addedContact.districts, function (err, foundContacts) {
                expect(foundContacts[0]._id).toEqual(addedContact._id);
                expect(isArrayEqual(foundContacts[0].districts, addedContact.districts)).toBeTruthy();
                done();
            });
        });
    });

    it("should find an empty contacts list by districts not exists", function (done) {
        contactsProvider.add(contact_jade, function () {
            contactsProvider.find("NotExistingDistrict", function (err, foundContacts) {
                expect(foundContacts.length).toBe(0);
                done();
            });
        });
    });

    it("should find contacts by ips", function (done) {
        contactsProvider.add(contact_jade, function (err, addedContact) {
            contactsProvider.find(addedContact.ips[0], function (err, foundContacts) {
                expect(foundContacts[0]._id).toEqual(addedContact._id);
                expect(isArrayEqual(foundContacts[0].districts, addedContact.districts)).toBeTruthy();
                expect(isArrayEqual(addedContact.ips, contact_jade.ips)).toBeTruthy();
                done();
            });
        });
    });

    it("should find contacts by ips and createdByUserId", function (done) {
        contactsProvider.add(contact_jade, function (err, addedContact) {
            contactsProvider.findExtended(addedContact.createdByUserId, addedContact.ips[0],
                function (err, foundContacts) {
                    expect(foundContacts[0]._id).toEqual(addedContact._id);
                    expect(isArrayEqual(foundContacts[0].districts, addedContact.districts)).toBeTruthy();
                    expect(isArrayEqual(addedContact.ips, contact_jade.ips)).toBeTruthy();
                    done();
                });
        });
    });

    it("should find empty contacts list by ips not exist", function (done) {
        contactsProvider.add(contact_jade, function () {
            contactsProvider.find("NotExistingIPS", function (err, foundContacts) {
                expect(foundContacts.length).toBe(0);
                done();
            });
        });
    });

    it("should delete a contact by id", function (done) {
        contactsProvider.addAll(contacts, function () {
            contactsProvider.findAll(function (err, foundContacts) {
                var contactToDelete = foundContacts[0];
                contactsProvider.delete(contactToDelete._id, function () {
                    contactsProvider.findAll(function (err, contacts) {
                        expect(contacts.length).toBe(1);
                        done();
                    });
                });
            });
        });
    });
});
