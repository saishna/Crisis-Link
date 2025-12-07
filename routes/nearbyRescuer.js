const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get nearest rescuers
router.post('/nearby', async (req, res) => {
    const { lat, lng, maxDistance } = req.body;

    if (!lat || !lng) {
        return res.status(400).json({ msg: "User location lat & lng required" });
    }

    try {
        const rescuers = await User.find({
            role: 'rescuer',
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [lng, lat] // IMPORTANT: longitude first
                    },
                    $maxDistance: maxDistance || 5000 // default: 5km
                }
            }
        }).select('name email location'); // Only return needed fields

        if (rescuers.length === 0) {
            return res.status(404).json({ msg: "No rescuers found nearby" });
        }

        res.json({ count: rescuers.length, rescuers });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
