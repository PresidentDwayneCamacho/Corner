/* menu.js */

var express = require('express');
var router = express.Router();

router.get('/menu',function(req,res,next){
    res.render('menu');
});

module.exports = router;