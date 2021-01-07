'use strict';
module.exports = function(app) {
  var todoList = require('../controllers/ApiController');

  // API List Routes
  app.route('/aggregate')
    .post(todoList.aggregate);

  app.route('/Teste/:msgTeste')
    .get(todoList.teste);

  app.get('/Benny/:msg', function(req,res) {
    res.json('Beeny says ' + req.params.msg) }
  )
};