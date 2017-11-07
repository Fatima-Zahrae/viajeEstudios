'use strict';
var config = require('../../server/config.json');
var path = require('path'); 

module.exports = function(Usuario) {
    
     //send verification email after registration
  Usuario.afterRemote('create', function(context, usuario, next) {
    var options = {
      type: 'email',
      to: usuario.email,
      from: 'noreply@loopback.com',
      subject: 'Thanks for registering.',
      template: path.resolve(__dirname, '../../server/views/verify.ejs'),
      redirect: '/verified',
      usuario: usuario
    };

    usuario.verify(options, function(err, response) {
      if (err) {
        Usuario.deleteById(usuario.id);
        return next(err);
      }
      context.res.render('response', {
        title: 'Signed up successfully',
        content: 'Please check your email and click on the verification link ' +
            'before logging in.',
        redirectTo: '/',
        redirectToLinkText: 'Log in'
      });
    });
});

};
