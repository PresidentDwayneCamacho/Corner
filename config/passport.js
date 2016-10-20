// passport setup
var LocalStrategy    = require('passport-local').Strategy;
var Profile       = require('../models/profile');

module.exports = function(passport) {

    passport.serializeUser(function(profile, done) {
        done(null, profile.id);
    });
    passport.deserializeUser(function(id, done) {
        Profile.findById(id, function(err, profile) {
            done(err, profile);
        });
    });

    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback : true // allows us to pass in the req from our route
    },function(req, email, password, done) {
        if (email){ email = email.toLowerCase(); }
        // asynchronous
        process.nextTick(function() {
            Profile.findOne({ 'email' :  email }, function(err, profile) {
                if (err){ return done(err); }
                if (!profile){
                    return done(null, false, req.flash('loginMessage', 'No user found.'));
                }
                if (!profile.validPassword(password)){
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                }
                else{ return done(null, profile); }
            });
        });

    }));

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },function(req, email, password, done) {
        if (email){ email = email.toLowerCase(); }
        // asynchronous
        process.nextTick(function() {
            // if the user is not already logged in:
            if (!req.profile) {
                Profile.findOne({ 'email': email }, function(err, profile) {
                    if (err){ return done(err); }
                    if (profile) {
                        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                    } else {
                        var re = new RegExp('@cpp.edu$');
                        if(!re.test(email)){
                            return done(null, false, req.flash('signupMessage','Not a Cal Poly Pomona email account.'));
                        }
                        var confirm = req.body.confirm;
                        if(password != confirm){
                            return done(null,false,req.flash('signupMessage','Passwords do not match'));
                        }

                        var newProfile = new Profile();
                        newProfile.first = req.body.first;
                        newProfile.last = req.body.last;
                        newProfile.email = email;
                        newProfile.password = newProfile.generateHash(password);
                        newProfile.save(function(err) {
                            if (err){ return done(err); }
                            return done(null, newProfile);
                        });
                    }
                });
            // if the user is logged in but has no local account
            } else if ( !req.profile.email ) {
                // check if the email used to connect a local account is being used by another user
                Profile.findOne({ 'email': email }, function(err, profile) {
                    if (err)
                        return done(err);
                    if (profile) {
                        return done(null, false, req.flash('loginMessage', 'That email is already taken.'));
                    } else {
                        var profile = req.profile;
                        profile.email = email;
                        profile.password = profile.generateHash(password);
                        profile.save(function (err) {
                            if (err)
                                return done(err);
                            return done(null,profile);
                        });
                    }
                });
            } else {
                return done(null, req.profile);
            }
        });
    }));
};
