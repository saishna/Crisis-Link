const express = require('express');
const router = express.Router();
const RequestApproval = require('../models/RequestApproval');

// Create a new flood zone request (CREATE)
router.post('/', async (req, res) => {
    try {
        const requestApproval = new RequestApproval(req.body);
        const savedRequest = await requestApproval.save();
        res.status(201).json(savedRequest);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all flood zone requests (READ ALL)
router.get('/', async (req, res) => {
    try {
        const requests = await RequestApproval.find().populate('initiator', 'name email');
        res.json(requests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a single flood zone request by ID (READ ONE)
router.get('/:id', async (req, res) => {
    try {
        const request = await RequestApproval.findById(req.params.id).populate('initiator', 'name email');
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }
        res.json(request);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a flood zone request (UPDATE)
router.put('/:id', async (req, res) => {
    try {
        const updatedRequest = await RequestApproval.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedRequest) {
            return res.status(404).json({ message: 'Request not found' });
        }
        res.json(updatedRequest);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a flood zone request (DELETE)
router.delete('/:id', async (req, res) => {
    try {
        const deletedRequest = await RequestApproval.findByIdAndDelete(req.params.id);
        if (!deletedRequest) {
            return res.status(404).json({ message: 'Request not found' });
        }
        res.json({ message: 'Request deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Approve a flood zone request (CUSTOM UPDATE)
router.patch('/approve/:id', async (req, res) => {
    try {
        const updatedRequest = await RequestApproval.findByIdAndUpdate(
            req.params.id,
            { status: 'Approved' },
            { new: true }
        );
        if (!updatedRequest) {
            return res.status(404).json({ message: 'Request not found' });
        }
        res.json(updatedRequest);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Reject a flood zone request (CUSTOM UPDATE)
router.patch('/reject/:id', async (req, res) => {
    try {
        const updatedRequest = await RequestApproval.findByIdAndUpdate(
            req.params.id,
            { status: 'Rejected' },
            { new: true }
        );
        if (!updatedRequest) {
            return res.status(404).json({ message: 'Request not found' });
        }
        res.json(updatedRequest);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
