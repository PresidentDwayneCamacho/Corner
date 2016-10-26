/**
 * the backend routing system
 * receives $http requests from angular router
 * sends res.send(...) responses back to angular
 */

var express = require('express');
var router = express();
var path = require('path');
var Posting = require('../models/posting');
var passport = require('passport');


// tests authentication
function isAuthenticated(req,res,next){
    if(req.isAuthenticated()){ return next(); }
    res.redirect('/');
}


// renders the posting screen
router.get('/posting',isAuthenticated,function(req,res,next){
    Posting.find(function(err,posts){
        if(err){ return res.send(500,err); }
        return res.send(posts);
    });
});


// can this method be deleted?
router.post('/posting',isAuthenticated,function(req,res,next){
    var newPosting = new Posting();
    newPosting.header = req.body.header;
    newPosting.category = req.body.category;
    newPosting.subcategory = req.body.subcategory;
    newPosting.textbody = req.body.textbody;
    newPosting.save(function(err,posts){
        if(err){ return res.send(500,err); }
        return res.json(posts);
    });
});


router.get('/posting/:id',isAuthenticated,function(req,res,next){
    console.log('get posting from router with id');
    Posting.find({email:req.params.id},function(err,posts){
        if(err){ return res.send(500,err); }
        return res.send(posts);
    });
});


router.post('/posting/:id',isAuthenticated,function(req,res,next){
    var newPosting = new Posting();
    newPosting.header = req.body.header;
    newPosting.category = req.body.category;
    newPosting.subcategory = req.body.subcategory;
    newPosting.textbody = req.body.textbody;
    newPosting.createdBy = req.params.id;
    console.log('From the id-specific post: ' + req.params.id);
    newPosting.save(function(err,posts){
        if(err){ return res.send(500,err); }
        return res.json(posts);
    });
});


router.get('/profile/:id',isAuthenticated,function(req,res,next){
    Posting.find({createdBy: req.params.id},function(err,posts){
        if(err){ return res.send(500,err); }
        return res.send(posts);
    });
});


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
