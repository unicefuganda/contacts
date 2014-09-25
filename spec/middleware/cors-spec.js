var fs = require('fs');
var app = require('../../app/server');
var request = require('supertest');

describe('/api/*', function () {
    var allowedOrigins;
    beforeEach(function() {
        var configContent = fs.readFileSync('./config/config.json');
        var config = JSON.parse(configContent);
        allowedOrigins = config.ALLOWED_ORIGINS;
    });

    it('allows cross origin requests from host allowed in config', function (done) {
        var allowedOriginWithPort = allowedOrigins[0] + ":3000";
        request(app)
            .get('/api/')
            .set('Accept', 'application/json')
            .set('origin', allowedOriginWithPort)
            .expect(function (response) {
                var headers = response.headers;
                expect(headers['access-control-allow-origin']).toBe(allowedOriginWithPort);
            })
            .expect(200, done);
    });

    it("puts null in the cors header for requests coming from clients without 'origin' header set", function(done) {
        request(app)
            .get('/api/')
            .set('Accept', 'application/json')
            .expect(function (response) {
                var headers = response.headers;
                expect(headers['access-control-allow-origin']).toBe('null');
            })
            .expect(200, done);
    });

    it('puts null in the cors header for requests coming from origins not allowed in config', function(done) {
        request(app)
            .get('/api/')
            .set('Accept', 'application/json')
            .set('origin', 'http://disallowed-origin-for-test')
            .expect(function (response) {
                var headers = response.headers;
                expect(headers['access-control-allow-origin']).toBe('null');
            })
            .expect(200, done);
    });
});