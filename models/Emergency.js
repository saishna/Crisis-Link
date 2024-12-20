const mongoose = require('mongoose');

const emergencySchema = new mongoose.Schema({
    name: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    number: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true }, // New address field added
});

module.exports = mongoose.model('Emergency', emergencySchema);
