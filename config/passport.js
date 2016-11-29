// passport setup
// allows user to sign in/out
// check documentation for information
var LocalStrategy = require('passport-local').Strategy;
var Profile = require('../models/profile');

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
            Profile.findOne({ 'email': email }, function(err, profile) {
                if (err){ return done(err); }
                if (!profile){
                    return done(null, false);
                }
                if (!profile.validPassword(password)){
                    return done(null, false);
                }
                else { return done(null, profile); }
            });
        });

    }));

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },function(req, email, password, done) {
        if (email){ email = email.toLowerCase(); }
        // asynchronous
        process.nextTick(function() {
            // if the user is not already logged in:
            if (!req.profile) {
                Profile.findOne({ 'email': email }, function(err, profile) {
                    if (err){ return done(err); }
                    if (profile) {
                        return done(null, false);
                    } else {
                        var re = new RegExp('@cpp.edu$');
                        if(!re.test(email)){
                            return done(null, false);
                        }
                        var confirm = req.body.confirm;
                        if(password != confirm){
                            return done(null,false);
                        }

                        var newProfile = new Profile();
                        newProfile.first = req.body.first;
                        newProfile.last = req.body.last;
                        newProfile.major = req.body.major;
                        newProfile.interests = req.body.interests;
                        newProfile.dating = req.body.dating;
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
                        return done(null, false);
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
