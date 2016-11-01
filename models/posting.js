/*
    posting.js
    the model for a specific posting for mongoose/mongodb
*/

var mongoose = require('mongoose');

var PostingSchema = mongoose.Schema({
    header: {type: String, required: true},
    category: {type: String, required: true},
    subcategories: {type: String},
    textbody: {type: String, required: true},
    createdBy: {
        email: {type: String, required: true},
        first: {type: String, required: true},
        last: {type: String, required: true}
    },
    createdAt: {type: Date, default: Date.now}
});

// add text index for subcategories
PostingSchema.index({header:'text',category:'text',textbody:'text'});

module.exports = mongoose.model('Posting',PostingSchema);
