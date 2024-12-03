const mongoose = require('mongoose');

const emergencySchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    number: { type: String, required: true },
    email: { type: String, required: true },
});

module.exports = mongoose.model('Emergency', emergencySchema);
