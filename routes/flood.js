const express = require('express');
const router = express.Router(); // Define the router
const FloodZone = require('../models/FloodZone'); // Import the FloodZone model

// Create a new flood zone
router.post('/', async (req, res) => {
    const { name, location, riskLevel, resolved } = req.body;

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
            resolved: resolved || false, // Default to false if not provided
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

router.get('/', async (req, res) => {
    try {
        const floodZones = await FloodZone.find({ resolved: false }); // Fetch only active flood zones
        res.json(floodZones);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching flood zones' });
    }
});


// // Get all flood zones
// router.get('/', async (req, res) => {
//     try {
//         const floodZones = await FloodZone.find(); // Fetch all flood zones
//         res.status(200).json(floodZones);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// Get a specific flood zone by ID
router.get('/:id', async (req, res) => {
    try {
        const floodZone = await FloodZone.findById(req.params.id);
        if (!floodZone) {
            return res.status(404).json({ error: 'Flood zone not found' });
        }
        res.status(200).json(floodZone);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a flood zone by ID
router.put('/:id', async (req, res) => {
    const { name, location, riskLevel, resolved } = req.body;

    try {
        // Find and update the flood zone
        const floodZone = await FloodZone.findByIdAndUpdate(
            req.params.id,
            {
                name,
                location,
                riskLevel,
                resolved,
            },
            { new: true } // Return the updated document
        );

        if (!floodZone) {
            return res.status(404).json({ error: 'Flood zone not found' });
        }

        res.status(200).json({ message: 'Flood zone updated', floodZone });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete a flood zone by ID
router.delete('/:id', async (req, res) => {
    try {
        const floodZone = await FloodZone.findByIdAndDelete(req.params.id);

        if (!floodZone) {
            return res.status(404).json({ error: 'Flood zone not found' });
        }

        res.status(200).json({ message: 'Flood zone deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router; // Export the router
