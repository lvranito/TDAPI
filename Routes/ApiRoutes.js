'use strict';
module.exports = function(app) {
  var todoList = require('../Controllers/ApiController');

  // API List Routes
  app.route('/aggregate')
    .post(todoList.aggregate);

  app.route('/Teste/:msgTeste')
    .get(todoList.teste);

};