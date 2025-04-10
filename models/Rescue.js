const mongoose = require('mongoose');

const rescueSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    risk: {
        type: String,
        enum: ['High', 'Low'], // Only 'High' or 'Low' are valid
        required: true
    },
    status: {
        type: String,
        enum: ['Active', 'Closed'], // Only 'Active' or 'Closed' are valid
        required: true
    },
    location: {
        address: {
            type: String,
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    action: {
        type: String,
        enum: ['Resolved', 'Unresolved'], // Only 'Resolved' or 'Unresolved' are valid
        required: true
    }
});

// Create the model from the schema
const Rescue = mongoose.model('Rescue', rescueSchema);

module.exports = Rescue;
