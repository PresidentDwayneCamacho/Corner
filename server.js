/* server.js */

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var flash = require('connect-flash');
var morgan = require('morgan');
var session = require('express-session');
var mongoose = require('mongoose');

var app = express();
mongoose.connect('mongodb://localhost:27017/posting');

var profile = require('./routes/profile');
var posting = require('./routes/posting');
var error = require('./routes/error');
var menu = require('./routes/menu');

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
require('./config/passport')(passport);

app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));
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
app.use(flash());

app.use(posting);
app.use(error);
app.use(menu);
require('./routes/profile.js')(app,passport);

// listens to server
app.set('port',process.env.PORT || 3000);
app.listen(app.get('port'),function(){
    console.log('Server started on port ' + app.get('port'));
});
