const express = require('express');
const router = express.Router();
const Rescue = require('../models/Rescue'); // adjust path as needed





// Create a rescue
router.post('/', async (req, res) => {
    try {
        const rescue = new Rescue(req.body);
        console.log(rescue);
        await rescue.save();
        res.status(201).json(rescue);
    } catch (err) {
        res.status(400).json({ error: err.message, details: err.errors });


    }
});

// Get all rescues
router.get('/', async (req, res) => {
    try {
        const rescues = await Rescue.find();
        res.json(rescues);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a single rescue by ID
router.get('/:id', async (req, res) => {
    try {
        const rescue = await Rescue.findById(req.params.id);
        if (!rescue) return res.status(404).json({ error: 'Rescue not found' });
        res.json(rescue);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a rescue
router.put('/:id', async (req, res) => {
    try {
        const rescue = await Rescue.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        });
        if (!rescue) return res.status(404).json({ error: 'Rescue not found' });
        res.json(rescue);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete a rescue
router.delete('/:id', async (req, res) => {
    try {
        const rescue = await Rescue.findByIdAndDelete(req.params.id);
        if (!rescue) return res.status(404).json({ error: 'Rescue not found' });
        res.json({ message: 'Rescue deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update action status (resolved/unresolved)
router.patch('/:id/action', async (req, res) => {
    try {
        const { action } = req.body;
        if (!['Resolved', 'Unresolved'].includes(action)) {
            return res.status(400).json({ error: 'Invalid action value' });
        }
        const rescue = await Rescue.findByIdAndUpdate(
            req.params.id,
            { action },
            { new: true }
        );
        if (!rescue) return res.status(404).json({ error: 'Rescue not found' });
        res.json(rescue);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;


