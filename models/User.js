const mongoose = require('mongoose');

// Really simple user schema, storing userId and if said user has already reacted to the server rules and said hello
const UserSchema = mongoose.Schema({
    uniqueId: { type: String, required: true, unique: true},
    username: { type: String, required: true },
    joinedAt: { type: Date, required: true},
    reactedToRules: { type: Boolean, required: true, default: false},
    saidHello: { type: Boolean, required: true, default: false}
})

module.exports = mongoose.model('User', UserSchema);