module.exports = function () {
    return {
        isArrayEqual: function (actual_array, expected_array) {
            return actual_array.toString() === expected_array.toString();
        }
    }
};
