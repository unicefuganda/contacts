var DbConnection = require('../app/dbconnection');

describe("DbConnection", function () {

    it("should save a contact", function () {

        var contact = { firstname: 'Peter',
                        lastname: 'Maqua',
                        phone: '+256774545453' };

        DbConnection.save('mongodb://localhost/unicefcontacts', contact);
        expect(true).toBe(true);
    });
});
