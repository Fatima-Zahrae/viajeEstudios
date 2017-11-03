'use strict';


var dsConfig = require('../datasources.local.js');
var path = require('path');

module.exports = function(app) {
    var usuario = app.models.Usuario;
      var router = app.loopback.Router();
    //login page
  router.get('/', function(req, res) {
    var credentials = dsConfig.myEmailDatasource.transports[0].auth;
    res.render('login', {
      email: credentials.user,
      password: credentials.pass
    });
});

  app.use(router);
};





