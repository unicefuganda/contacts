module.exports = function() {
    return {
        allowCors: function(appInstance) {
            appInstance.use("/api/*", function (request, response, next) {
                response.header('Access-Control-Allow-Origin', 'http://localhost:8000');
                next();
            });
            return appInstance;
        }
    }
};