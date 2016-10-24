/* 
    server.js
    entry point for the program
*/

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var logger = require('morgan');
var session = require('express-session');
var app = express();
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/post-rough');
require('./config/passport')(passport);
app.use(express.static(path.join(__dirname, 'public')));

var api = require('./routes/api.js');

app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(session({
    secret: '23zwk3dDK384idw2SEWI23fwe9WRe',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/',api);

// listens to server
app.set('port',process.env.PORT || 3000);
app.listen(app.get('port'),function(){
    console.log('Server started on port ' + app.get('port'));
});
