var path = require('path');  
var config = require('./config');
var express = require('express');
var app = express();
module.exports = app;

function main() {
  var http = require('http');

  app.set('view engine', 'ejs');
  app.set('view options', { layout: false });
  app.use(express.static(path.join(__dirname, 'public')));

  var server = http.createServer(app);

  // Load all routes.
  require('./routes')(app);

  // Listen on http port.
  server.listen(process.env.PORT);
}

main();
