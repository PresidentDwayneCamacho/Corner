/**
 * the model for inbox messages
 */

var mongoose = require('mongoose');

var MessageSchema = mongoose.Schema({
    header: {type: String},
    sender: {
        email: {type: String, required: true},
        first: {type: String, required: true},
        last: {type: String, required: true}
    },
    recipient: {
        email: {type: String, required: true},
        first: {type: String, required: true},
        last: {type: String, required: true}
    },
    textbody: {type: String, required: true},
    createdAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Message',MessageSchema);
