const express = require('express');
const router = express.Router();
const Emergency = require('../models/Emergency');
const Helpline = require('../models/Helpline');

// Utility function to get the appropriate model based on type
const getModelByType = (type) => {
    if (type === 'emergency') return Emergency;
    if (type === 'helpline') return Helpline;
    return null;
};

// Create a new entry
router.post('/:type', async (req, res) => {
    const { type } = req.params;
    const Model = getModelByType(type);

    if (!Model) return res.status(400).json({ error: 'Invalid type specified' });

    try {
        const entry = new Model(req.body); // Create a new document
        await entry.save(); // Save to the database
        res.status(201).json(entry); // Respond with the saved document
    } catch (err) {
        res.status(400).json({ error: err.message }); // Handle errors
    }
});

// Get all entries of a specific type
router.get('/:type', async (req, res) => {
    const { type } = req.params;
    const Model = getModelByType(type);

    if (!Model) return res.status(400).json({ error: 'Invalid type specified' });

    try {
        const entries = await Model.find(); // Fetch all entries
        res.status(200).json(entries); // Respond with the fetched documents
    } catch (err) {
        res.status(400).json({ error: err.message }); // Handle errors
    }
});

// Get a single entry by ID
router.get('/:type/:id', async (req, res) => {
    const { type, id } = req.params;
    const Model = getModelByType(type);

    if (!Model) return res.status(400).json({ error: 'Invalid type specified' });

    try {
        const entry = await Model.findById(id); // Fetch entry by ID
        if (!entry) return res.status(404).json({ error: 'Entry not found' });

        res.status(200).json(entry); // Respond with the fetched document
    } catch (err) {
        res.status(400).json({ error: err.message }); // Handle errors
    }
});

// Update an entry by ID
router.put('/:type/:id', async (req, res) => {
    const { type, id } = req.params;
    const Model = getModelByType(type);

    if (!Model) return res.status(400).json({ error: 'Invalid type specified' });

    try {
        const entry = await Model.findByIdAndUpdate(id, req.body, { new: true }); // Update entry by ID
        if (!entry) return res.status(404).json({ error: 'Entry not found' });

        res.status(200).json(entry); // Respond with the updated document
    } catch (err) {
        res.status(400).json({ error: err.message }); // Handle errors
    }
});

// Delete an entry by ID
router.delete('/:type/:id', async (req, res) => {
    const { type, id } = req.params;
    const Model = getModelByType(type);

    if (!Model) return res.status(400).json({ error: 'Invalid type specified' });

    try {
        const entry = await Model.findByIdAndDelete(id); // Delete entry by ID
        if (!entry) return res.status(404).json({ error: 'Entry not found' });

        res.status(200).json({ message: 'Entry deleted successfully' }); // Respond with success message
    } catch (err) {
        res.status(400).json({ error: err.message }); // Handle errors
    }
});

module.exports = router;
