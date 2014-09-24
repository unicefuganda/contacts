var fs = require('fs');

var validateOrigin = function (origin, callback) {
    fs.readFile('./config/config.json', 'utf8', function (err, data) {
        var allowedOrigins = JSON.parse(data).ALLOWED_ORIGINS;

        var matchedOrigin = allowedOrigins.filter(function (allowedOrigin) {
            return origin.indexOf(allowedOrigin) >= 0;
        })[0];

        callback(matchedOrigin !== undefined);
    });
};

module.exports = function () {
    return {
        allowCors: function (appInstance) {
            appInstance.use("/api/*", function (request, response, next) {
                var origin = request.get('origin') || "";
                validateOrigin(origin, function(originIsValid) {
                    var originInResponse = null;
                    if(originIsValid) originInResponse = origin;
                    response.header('Access-Control-Allow-Origin', originInResponse);
                    next();
                });
            });
            return appInstance;
        }
    }
};