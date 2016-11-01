/**
 * the backend routing system
 * receives $http requests from angular router
 * sends res.send(...) responses back to angular
 */

var express = require('express');
var router = express();
var path = require('path');
var Profile = require('../models/profile');
var Posting = require('../models/posting');
var Message = require('../models/message');
var passport = require('passport');


// tests authentication
function isAuthenticated(req,res,next){
    if(req.isAuthenticated()){ return next(); }
    res.redirect('/');
}


// renders the posting screen
// returns the posts to angular router
router.get('/posting',isAuthenticated,function(req,res,next){
    Posting.find(function(err,posts){
        if(err){ return res.send(500,err); }
        return res.send(posts);
    });
});


// returns a user's post to the angular router
// user id is passed, and query database by id
router.get('/posting/:id',isAuthenticated,function(req,res,next){
    Posting.find({'createdBy.email':req.params.id},function(err,posts){
        if(err){ return res.send(500,err); }
        return res.send(posts);
    });
});


// place post into database, including poster id
router.post('/posting/:id',isAuthenticated,function(req,res,next){

    var newPosting = new Posting({
        header: req.body.header,
        category: req.body.category,
        subcategory: req.body.subcategory,
        textbody: req.body.textbody,
        createdBy: {
            email: req.body.email,
            first: req.body.first,
            last: req.body.last
        }
    });

    newPosting.save(function(err,posts){
        if(err){ return res.send(500,err); }
        return res.json(posts);
    });
});


// delete post
router.delete('/posting/:id',function(req,res){
    console.log('Deleted post back router ' + req.params.id);
    Posting.remove({_id: req.params.id},function(err,posts){
        if(err){ return res.send(500); }
        return res.send(posts);
    });
});


// returns a user's post to the angular router
// user id is passed, and query database by id
router.get('/profile/:id',isAuthenticated,function(req,res,next){
    //console.log('get profile '+req.params.id);
    Posting.find({'createdBy.email': req.params.id},function(err,posts){
        if(err){ return res.send(500,err); }
        return res.send(posts);
    });
});


router.post('/beginMessage',function(req,res,next){
    res.send({
        header: req.body.header,
        recipient: req.body.createdBy.email,
        textbody: ''
    });
});


// add promises to this...
router.post('/sendMessage',function(req,res,next){
    //console.log('backend post sendMessage: ' + req.body.recipient);

    Profile.find({email:req.body.recipient},function(err,profile){
        //console.log('beginning of profile find');
        if(err){ return res.send(500,err); }
        var receiver = {
            email: profile.email,
            first: profile.first,
            last: profile.last
        };

        console.log('in Profile.find ' + receiver.email);
    });
    
});


// returns success or failure message to database from login/register routes
router.get('/success',function(req,res){
    res.send({state:'success', profile: req.user ? req.user : null});
});

router.get('/failure',function(req,res){
    res.send({state:'failure'});
});

router.post('/login', passport.authenticate('local-login',{
    successRedirect:'/success',
    failureRedirect:'/failure'
}));

router.post('/register',passport.authenticate('local-signup',{
    successRedirect:'/success',
    failureRedirect:'/failure'
}));


// catch 404 and forward to error handler
router.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    res.sendFile(path.join(__dirname,'../public/error.html'))
});


// development error handler
// will print stacktrace
if (router.get('env') === 'development') {
    router.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.sendFile(path.join(__dirname,'../public/error.html'));
    });
}


// production error handler
// no stacktraces leaked to user
router.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.sendFile(path.join(__dirname,'../public/error.html'));
});


module.exports = router;
