const express = require('express');
const router = express.Router(); // Define the router
const FloodZone = require('../models/FloodZone'); // Import the FloodZone model

// Create a new flood zone
router.post('/', async (req, res) => {
    const { name, location, riskLevel } = req.body;

    // Validate location coordinates
    if (!location || !location.coordinates || location.coordinates.length !== 2) {
        return res.status(400).json({ error: 'Coordinates are required and must be in [latitude, longitude] format' });
    }

    try {
        // Create a new flood zone
        const floodZone = new FloodZone({
            name,
            location,
            riskLevel,
        });

        // Save it to the database
        await floodZone.save();

        // Respond with success
        res.status(201).json({ message: 'Flood zone created', floodZone });
    } catch (err) {
        // Handle errors
        res.status(400).json({ error: err.message });
    }
});

module.exports = router; // Export the router



