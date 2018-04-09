// Load required modules
var http    = require("http");              // http server core module
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Routes
var index = require('./routes/index');
const help = require('./routes/help');
const lobby = require('./routes/lobby');
const lobbyList = require('./routes/lobbyList');
const makeLobby = require('./routes/makeLobby');
const test = require('./routes/test');

var app = express();

// Set process name
// process.title = "node-easyrtc";

// Get port or default to 3000
var port = 3000;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/javascripts', express.static(__dirname + '/node_modules/easyrtc/api/'));

// Include jquery
app.use('/javascripts', express.static(__dirname+'/node_modules/jquery/dist/')); 

// Include Bootstrap
app.use('/stylesheets', express.static(__dirname+'/node_modules/bootstrap/dist/css/'));
app.use('/javascripts', express.static(__dirname+'/node_modules/bootstrap/dist/js/'));

app.use('/', index);
app.use('/test', test);
app.use('/help', help);
app.use('/lobby', lobby);
app.use('/lobbyList', lobbyList);
app.use('/makeLobby', makeLobby);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
