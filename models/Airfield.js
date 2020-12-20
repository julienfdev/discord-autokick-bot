const mongoose = require('mongoose');

// Really simple user schema, storing userId and if said user has already reacted to the server rules and said hello
const AirfieldSchema = mongoose.Schema({
    icao: { type: String, required: true, unique: true},
    airfieldName: { type: String, required: true },
})

module.exports = mongoose.model('Airfield', AirfieldSchema);