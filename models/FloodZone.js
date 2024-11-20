const mongoose = require('mongoose');

// Define the schema for a Flood Zone
const FloodZoneSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    location: {
        coordinates: {
            type: [Number], // Array of two numbers: [latitude, longitude]
            required: true,
        },
        address: {
            type: String, // Optional textual representation of the location
        },
    },
    riskLevel: {
        type: String,
        enum: ['Low', 'Medium', 'High'], // Restrict values to these options
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now, // Automatically set the date of creation
    },
});

// Create a model from the schema
const FloodZone = mongoose.model('FloodZone', FloodZoneSchema);

module.exports = FloodZone;
