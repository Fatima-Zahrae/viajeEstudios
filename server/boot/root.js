'use strict';


var dsConfig = require('../datasources.local.js');
var path = require('path');
//var usuario = app.models.Usuario;

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

//verified
  app.get('/verified', function(req, res) {
    res.render('verified');
});

//log a user in
  app.post('/login', function(req, res) {
    usuario.login({
      email: req.body.email,    
      password: req.body.password
    }, 'user', function(err, token) {
      if (err) {
        if(err.details && err.code === 'LOGIN_FAILED_EMAIL_NOT_VERIFIED'){
          res.render('reponseToTriggerEmail', {
            title: 'Login failed',
            content: err,
            redirectToEmail: '/api/Usuarios/'+ err.details.userId + '/verify',
            redirectTo: '/',
            redirectToLinkText: 'Click here',
            userId: err.details.userId
          });
        } else {
          res.render('response', {
            title: 'Login failed. Wrong username or password',
            content: err,
            redirectTo: '/',
            redirectToLinkText: 'Please login again',
          });
        }
        return;
      }
      res.render('home', {
        email: req.body.EMAIL_USER,
        accessToken: token.id,
        redirectUrl: '/api/Usuarios/change-password?access_token=' + token.id
      });
    });
});

  //log a user out
  
  app.get('/logout', function(req, res, next) {
    if (!req.accessToken) return res.sendStatus(401);
    usuario.logout(req.accessToken.id, function(err) {
      if (err) return next(err);
      res.redirect('/');
    });
});

//send an email with instructions to reset an existing user's password
  app.post('/request-password-reset', function(req, res, next) {
    usuario.resetPassword({
      email: req.body.email
    }, function(err) {
      if (err) return res.status(401).send(err);

      res.render('response', {
        title: 'Password reset requested',
        content: 'Check your email for further instructions',
        redirectTo: '/',
        redirectToLinkText: 'Log in'
      });
    });
  });

  //show password reset form
  app.get('/reset-password', function(req, res, next) {
    if (!req.accessToken) return res.sendStatus(401);
    res.render('password-reset', {
      redirectUrl: '/api/Usuarios/reset-password?access_token='+
        req.accessToken.id
    });
  });

  app.use(router);
};










