/*
    posting routes
*/

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Posting = require('../models/posting');

router.get('/posting',function(req,res,next){
    Posting.find()
    .sort({createdAt:'descending'})
    .exec(function(err,postings){
        if(err){ return next(err); }
        res.render('posting',{postings: postings});
    });
});

// TODO: requires error checking
router.post('/posting',function(req,res,next){
    var header = req.body.header;
    var category = req.body.category;
    var subcategories = req.body.subcategories;
    var textbody = req.body.textbody;
    var createdAt = req.body.createdAt;
    var newPosting = new Posting({
        header: header,
        category: category,
        subcategories: subcategories,
        textbody: textbody,
        createdAt: createdAt
    });
    newPosting.save(next);
    res.redirect('/posting');
});

function ensureAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect('/login');
    }
}

module.exports = router;
