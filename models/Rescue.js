const mongoose = require('mongoose');

const rescueSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    risk: {
        type: String,
        enum: ['High', 'Low'],
        required: [true, 'Risk level is required']
    },
    status: {
        type: String,
        enum: ['Active', 'Closed'],
        required: [true, 'Status is required']
    },
    location: {
        address: {
            type: String,
            required: [true, 'Address is required']
        },
        coordinates: {
            lat: {
                type: Number,
                required: [true, 'Latitude is required']
            },
            lng: {
                type: Number,
                required: [true, 'Longitude is required']
            }
        }
    },
    action: {
        type: String,
        enum: ['Resolved', 'Unresolved'],
        required: [true, 'Action status is required']
    }
}, {
    timestamps: true
});

const Rescue = mongoose.model('Rescue', rescueSchema);

module.exports = Rescue;
