var path = require('path');
var config = require('./config');
var express = require('express');
var Datastore = require('nedb');
var bodyParser = require('body-parser');

var db = new Datastore({ filename: process.env.DBFILE, autoload: true });
var app = express();
module.exports = app;

function main() {
  var http = require('http');

  db.persistence.setAutocompactionInterval(process.env.AUTOCOMPACTTIMEOUT);

  app.use(bodyParser.json());
  app.set('view engine', 'ejs');
  app.set('view options', { layout: false });
  app.use(express.static(path.join(__dirname, 'public')));

  var server = http.createServer(app);

  // Load all routes.
  require('./routes')(app, db);
      
  // Listen on http port.
  //server.listen(process.env.PORT);
  console.log('Express server listening on port '+process.env.PORT);
}

main();
