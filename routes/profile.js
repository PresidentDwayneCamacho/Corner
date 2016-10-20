/* profile.js */


module.exports = function(app,passport){

    app.get('/',function(req,res,next){
        res.render('login')
    });

    app.post('/',passport.authenticate('local-login',{
        successRedirect:'/profile',
        failureRedirect:'/',
        failureFlash:true
    }));

    app.get('/login',function(req,res,next){
        res.redirect('/');
    });

    app.post('/login',passport.authenticate('local-login',{
        successRedirect:'/profile',
        failureRedirect:'/',
        failureFlash:true
    }));

    app.get('/profile', isLoggedIn, function(req,res,next){
        res.render('profile',{
            profile: req.user
        });
    });

    app.get('/logout',function(req,res){
        req.logout();
        res.redirect('/');
    });

    app.get('/register',function(req,res,next){
        res.render('register');
    });

    app.post('/register',passport.authenticate('local-signup',{
        successRedirect:'/profile',
        failureRedirect:'/register',
        failureFlash:true
    }));
}

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){ return next(); }
    res.redirect('/');
}
