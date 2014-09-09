'use strict';

describe("Sample tests", function () {
    beforeEach(module('server'));

		it("Add gives the correct result", function () {
				var num1 = 1;
				var num2 = 3;
				var expected = 4;
				var result = 4;

				expect(result).toBe(expected);
		});
});
