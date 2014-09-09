var http = require("http");
var url = require("url");

var Server  =function() { };

Server.add = function(a, b) {
  return a + b;
};

Server.start = function () {
  function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname;
    console.log("Request for " + pathname + " received.");
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("Hello World");
    response.end();
  }

  http.createServer(onRequest).listen(9000);
  console.log("Server has started.");
}

module.exports = Server;
