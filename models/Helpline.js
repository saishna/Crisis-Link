const mongoose = require('mongoose');

const helplineSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    number: { type: String, required: true },
    email: { type: String, required: true },
});

module.exports = mongoose.model('Helpline', helplineSchema);
