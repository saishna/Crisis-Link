const express = require('express');
const router = express.Router();
const Helpline = require('../models/Helpline');

// Function to calculate distance using Haversine formula
const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const a = 
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // distance in km
};

// ------------------- GET Route -------------------
router.get('/nearby', async (req, res) => {
    try {
        const { latitude, longitude, maxDistance = 5 } = req.query;

        if (!latitude || !longitude) {
            return res.status(400).json({ message: "Latitude and longitude are required" });
        }

        const lat = parseFloat(latitude);
        const lon = parseFloat(longitude);

        const helplines = await Helpline.find();

        const nearbyHelplines = helplines.filter(h => {
            const distance = getDistance(lat, lon, h.latitude, h.longitude);
            return distance <= maxDistance;
        });

        res.json(nearbyHelplines);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// ------------------- POST Route -------------------
router.post('/nearby', async (req, res) => {
    try {
        const { latitude, longitude, maxDistance = 5 } = req.body;

        if (!latitude || !longitude) {
            return res.status(400).json({ message: "Latitude and longitude are required" });
        }

        const lat = parseFloat(latitude);
        const lon = parseFloat(longitude);

        const helplines = await Helpline.find();

        const nearbyHelplines = helplines.filter(h => {
            const distance = getDistance(lat, lon, h.latitude, h.longitude);
            return distance <= maxDistance;
        });

        res.json(nearbyHelplines);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
