const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    uniqueId: { type: String, required: true, unique: true},
    username: { type: String, required: true },
    joinedAt: { type: Date, required: true},
    reactedToRules: { type: Boolean, required: true, default: false},
    saidHello: { type: Boolean, required: true, default: false}
})

module.exports = mongoose.model('User', UserSchema);