const express = require('express');
const router = express.Router();
const FloodZone = require('../models/FloodZone');

// CREATE - Add a new flood zone
router.post('/', async (req, res) => {
    try {
        const floodZone = new FloodZone({
            name: req.body.name,
            location: {
                coordinates: req.body.location.coordinates,
                address: req.body.location.address,
            },
            riskLevel: req.body.riskLevel,
            resolved: req.body.resolved || false,
            description: req.body.description,
        });

        const savedFloodZone = await floodZone.save();
        res.status(201).json({ message: 'Flood zone created', floodZone: savedFloodZone });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// READ ALL - Get all flood zones
router.get('/', async (req, res) => {
    try {
        const zones = await FloodZone.find();
        res.json(zones);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// READ ONE - Get a single flood zone by ID
router.get('/:id', async (req, res) => {
    try {
        const zone = await FloodZone.findById(req.params.id);
        if (!zone) return res.status(404).json({ error: 'Flood zone not found' });
        res.json(zone);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// UPDATE - Update a flood zone by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedZone = await FloodZone.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    name: req.body.name,
                    location: {
                        coordinates: req.body.location.coordinates,
                        address: req.body.location.address,
                    },
                    riskLevel: req.body.riskLevel,
                    resolved: req.body.resolved,
                    description: req.body.description,
                },
            },
            { new: true }
        );

        if (!updatedZone) return res.status(404).json({ error: 'Flood zone not found' });
        res.json({ message: 'Flood zone updated', floodZone: updatedZone });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE - Remove a flood zone by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedZone = await FloodZone.findByIdAndDelete(req.params.id);
        if (!deletedZone) return res.status(404).json({ error: 'Flood zone not found' });
        res.json({ message: 'Flood zone deleted', floodZone: deletedZone });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
