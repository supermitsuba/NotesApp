var fs = require('fs');
var path = require('path');

module.exports = function (app, dataProvider, smtpProvider) {

  fs.readdirSync('./routes/api').forEach(function (file) {
    // Avoid to read this current file.
    if (file === path.basename(__filename)) { return; }

    // Load the route file.
    require('./api/' + file)(app);

    if(process.env.DEBUGLOGGING){
      console.log('Loading API: %s', file);
    }
  });

  fs.readdirSync('./routes/site').forEach(function (file) {
    // Avoid to read this current file.
    if (file === path.basename(__filename)) { return; }

    // Load the route file.
    require('./site/' + file)(app);

    if(process.env.DEBUGLOGGING){
      console.log('Loading Site: %s', file);
    }
  });
};
