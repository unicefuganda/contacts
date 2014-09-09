var Server = require('../app/server');

describe("Server", function () {

		it("should add together two numbers", function () {
				expect(Server.add(1, 2)).toBe(3);
		});
});
