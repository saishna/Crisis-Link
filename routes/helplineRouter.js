const express = require('express');
const router = express.Router();
const Helpline = require('../models/Helpline'); // Ensure the model path is correct

// Create a new helpline entry
router.post('/', async (req, res) => {
    try {
        const helpline = new Helpline(req.body); // Create a new document
        await helpline.save(); // Save to the database
        res.status(201).json(helpline); // Respond with the saved document
    } catch (err) {
        res.status(400).json({ error: err.message }); // Handle errors
    }
});

// Get all helpline entries
router.get('/', async (req, res) => {
    try {
        const helplines = await Helpline.find(); // Fetch all helplines
        res.json(helplines); // Respond with the data
    } catch (err) {
        res.status(500).json({ error: err.message }); // Handle errors
    }
});

// Get a specific helpline entry
router.get('/:id', async (req, res) => {
    try {
        const helpline = await Helpline.findById(req.params.id); // Find by ID
        if (!helpline) return res.status(404).json({ error: 'Helpline not found' });
        res.json(helpline); // Respond with the document
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a helpline entry
router.put('/:id', async (req, res) => {
    try {
        const helpline = await Helpline.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Return the updated document
            runValidators: true, // Ensure validators are applied
        });
        if (!helpline) return res.status(404).json({ error: 'Helpline not found' });
        res.json(helpline); // Respond with the updated document
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete a helpline entry
router.delete('/:id', async (req, res) => {
    try {
        const helpline = await Helpline.findByIdAndDelete(req.params.id);
        if (!helpline) return res.status(404).json({ error: 'Helpline not found' });
        res.json({ message: 'Helpline deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
