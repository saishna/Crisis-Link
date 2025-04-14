const express = require('express');
const router = express.Router();
const Rescue = require('../models/Rescue'); // Adjust the path as needed

// CREATE - Add a new rescue request
router.post('/', async (req, res) => {
    try {
        const newRescue = new Rescue(req.body);
        const savedRescue = await newRescue.save();
        res.status(201).json(savedRescue);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// READ - Get all rescue requests
router.get('/', async (req, res) => {
    try {
        const rescues = await Rescue.find();
        res.status(200).json(rescues);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// READ - Get a single rescue request by ID
router.get('/:id', async (req, res) => {
    try {
        const rescue = await Rescue.findById(req.params.id);
        if (!rescue) return res.status(404).json({ error: 'Rescue not found' });
        res.status(200).json(rescue);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE - Update a rescue request by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedRescue = await Rescue.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedRescue) return res.status(404).json({ error: 'Rescue not found' });
        res.status(200).json(updatedRescue);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE - Delete a rescue request by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedRescue = await Rescue.findByIdAndDelete(req.params.id);
        if (!deletedRescue) return res.status(404).json({ error: 'Rescue not found' });
        res.status(200).json({ message: 'Rescue deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
