// Load required modules
var http    = require("http");              // http server core module
var socketIo = require("socket.io");        // web socket external module
var easyrtc = require("easyrtc");               // EasyRTC external module
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Routes
var index = require('./routes/index');
var users = require('./routes/users');
const test = require('./routes/test');

var app = express();

// Set process name
// process.title = "node-easyrtc";

// Get port or default to 3000
// var port = process.env.PORT || 3000;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
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
app.use('/users', users);
app.use('/test', test);

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

// var webServer = http.createServer(app);

// // Start Socket.io so it attaches itself to Express server
// var socketServer = socketIo.listen(webServer, {"log level":1});

// var myIceServers = [
//   {"url":"stun:stun.l.google.com:19302"},
//   {"url":"stun:stun1.l.google.com:19302"},
//   {"url":"stun:stun2.l.google.com:19302"},
//   {"url":"stun:stun3.l.google.com:19302"}
//   // {
//   //   "url":"turn:[ADDRESS]:[PORT]",
//   //   "username":"[USERNAME]",
//   //   "credential":"[CREDENTIAL]"
//   // },
//   // {
//   //   "url":"turn:[ADDRESS]:[PORT][?transport=tcp]",
//   //   "username":"[USERNAME]",
//   //   "credential":"[CREDENTIAL]"
//   // }
// ];
// easyrtc.setOption("appIceServers", myIceServers);
// easyrtc.setOption("logLevel", "debug");
// easyrtc.setOption("demosEnable", false);

// // Overriding the default easyrtcAuth listener, only so we can directly access its callback
// easyrtc.events.on("easyrtcAuth", function(socket, easyrtcid, msg, socketCallback, callback) {
//     easyrtc.events.defaultListeners.easyrtcAuth(socket, easyrtcid, msg, socketCallback, function(err, connectionObj){
//         if (err || !msg.msgData || !msg.msgData.credential || !connectionObj) {
//             callback(err, connectionObj);
//             return;
//         }

//         connectionObj.setField("credential", msg.msgData.credential, {"isShared":false});

//         console.log("["+easyrtcid+"] Credential saved!", connectionObj.getFieldValueSync("credential"));

//         callback(err, connectionObj);
//     });
// });

// // To test, lets print the credential to the console for every room join!
// easyrtc.events.on("roomJoin", function(connectionObj, roomName, roomParameter, callback) {
//     console.log("["+connectionObj.getEasyrtcid()+"] Credential retrieved!", connectionObj.getFieldValueSync("credential"));
//     easyrtc.events.defaultListeners.roomJoin(connectionObj, roomName, roomParameter, callback);
// });

// // Start EasyRTC server
// var rtc = easyrtc.listen(app, socketServer, null, function(err, rtcRef) {
//     console.log("Initiated");

//     rtcRef.events.on("roomCreate", function(appObj, creatorConnectionObj, roomName, roomOptions, callback) {
//         console.log("roomCreate fired! Trying to create: " + roomName);

//         appObj.events.defaultListeners.roomCreate(appObj, creatorConnectionObj, roomName, roomOptions, callback);
//     });
// });

// // listen on port
// webServer.listen(port, function () {
//     console.log('listening on http://localhost:' + port);
// });


module.exports = app;
