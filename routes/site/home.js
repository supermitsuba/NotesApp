var path = require('path');
var fs = require('fs');

module.exports = function (app, database, smtp) {
  app.get('/', IndexPage);
};

function IndexPage(req, res){
    var filePath = 'view/index.html';
    res.send(fs.readFileSync(filePath, 'utf8'));
    res.end();
};