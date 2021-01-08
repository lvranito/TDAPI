const express = require('express');
const app = express();
//#region configuration
var config = require('./Config.json');
const host = config.configuration.host;
const port = config.configuration.port;
//#endregion

//#region  parser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//#endregion

//#region logging
var logger = require('./Controllers/Logging');
app.use(logger());
//#endregion  

// Routes
var routes = require('./Routes/ApiRoutes'); //importing route
routes(app);

// start web server
//var server = app.listen(process.env.PORT || port, host, function () {
var server = app.listen(process.env.PORT || port, function () {
  var host = server.address().address;
  console.log('Listening at http://%s:%s', host, port)
})

console.log('RESTful API server started on: ' + port);

