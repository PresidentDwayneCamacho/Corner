/*
    posting routes
*/

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Posting = require('../models/posting');

router.get('/posting',isLoggedIn,function(req,res,next){
    Posting.find()
    .sort({createdAt:'descending'})
    .exec(function(err,postings){
        if(err){ return next(err); }
        res.render('posting',{postings: postings});
    });
});

// TODO: requires error checking
router.post('/posting',isLoggedIn,function(req,res,next){
    var header = req.body.header;
    var category = req.body.category;
    var subcategories = req.body.subcategories;
    var textbody = req.body.textbody;
    var newPosting = new Posting({
        header: header,
        category: category,
        subcategories: subcategories,
        textbody: textbody
    });
    newPosting.save(next);
    res.redirect('/posting');
});

router.post('/filter',function(req,res,next){
    var criteria = req.body.criteria;
    Posting.find({$text: {$search: criteria}})
    .sort({createdAt:'descending'})
    .exec(function(err,postings){
        if(err){ return next(err); }
        res.render('posting',{postings: postings})
    });
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){ return next(); }
    res.redirect('/');
}

module.exports = router;
