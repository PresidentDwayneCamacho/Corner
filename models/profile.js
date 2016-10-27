/*
    profile object
    model which replicates user information for mongodb/mongoose
*/

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var profileSchema = mongoose.Schema({
    first: {type: String, required: true},
    last: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    createdAt: {type: Date, default: Date.now}
});

profileSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password,bcrypt.genSaltSync(10),null);
}

profileSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password,this.password);
}

module.exports = mongoose.model('Profile',profileSchema);