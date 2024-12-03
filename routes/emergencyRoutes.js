const express = require('express');
const router = express.Router();
const Emergency = require('../models/Emergency'); // Ensure the model path is correct

// Create a new emergency entry
router.post('/', async (req, res) => {
    try {
        const emergency = new Emergency(req.body); // Create a new document
        await emergency.save(); // Save to the database
        res.status(201).json(emergency); // Respond with the saved document
    } catch (err) {
        res.status(400).json({ error: err.message }); // Handle errors
    }
});

// Get all emergency entries
router.get('/', async (req, res) => {
    try {
        const emergencies = await Emergency.find(); // Fetch all emergencies
        res.json(emergencies); // Respond with the data
    } catch (err) {
        res.status(500).json({ error: err.message }); // Handle errors
    }
});

// Get a specific emergency entry
router.get('/:id', async (req, res) => {
    try {
        const emergency = await Emergency.findById(req.params.id); // Find by ID
        if (!emergency) return res.status(404).json({ error: 'Emergency not found' });
        res.json(emergency); // Respond with the document
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update an emergency entry
router.put('/:id', async (req, res) => {
    try {
        const emergency = await Emergency.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Return the updated document
            runValidators: true, // Ensure validators are applied
        });
        if (!emergency) return res.status(404).json({ error: 'Emergency not found' });
        res.json(emergency); // Respond with the updated document
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete an emergency entry
router.delete('/:id', async (req, res) => {
    try {
        const emergency = await Emergency.findByIdAndDelete(req.params.id);
        if (!emergency) return res.status(404).json({ error: 'Emergency not found' });
        res.json({ message: 'Emergency deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
