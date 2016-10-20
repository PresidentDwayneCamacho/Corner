/*
    user.js
    model which replicates user information
*/

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var profileSchema = mongoose.Schema({
    //name: {type: String, required: true},
    email: {type: String, required: true, unique: true },
    password: {type: String, required: true}
});

profileSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password,bcrypt.genSaltSync(8),null);
}

profileSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password,this.password);
}

module.exports = mongoose.model('Profile',profileSchema);

