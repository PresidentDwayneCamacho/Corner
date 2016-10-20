/*
    posting.js
    the model for a specific posting for mongoose/mongodb
*/

var mongoose = require('mongoose');

var PostingSchema = mongoose.Schema({
    header: {type: String, required: true},
    category: {type: String, required: true},
    subcategories: [{type: String}],
    textbody: {type: String, required: true},
    createdAt: {type: Date, default: Date.now}
});

var Posting = mongoose.model('Posting',PostingSchema);
module.exports = Posting;
