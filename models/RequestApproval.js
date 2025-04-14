const mongoose = require('mongoose');

// Define the schema for a Flood Zone Request Approval
const RequestApprovalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    location: {
        coordinates: {
            type: [Number], // [latitude, longitude]
            required: true,
        },
        address: {
            type: String,
        },
    },
    riskLevel: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        required: true,
    },
    resolved: {
        type: Boolean,
        default: false,
    },
    description: {
        type: String,
        required: false,
    },
    proof: {
        type: String,
        required: true, // This stores the proof (image/file URL)
    },
    initiator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Create a model from the schema
const RequestApproval = mongoose.model('RequestApproval', RequestApprovalSchema);

module.exports = RequestApproval;
