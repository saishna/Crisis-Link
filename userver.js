// server.js (Backend)

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const FloodZone = require('./models/FloodZone');  // Assuming your model is in ./models/FloodZone.js

const app = express();

// Enable CORS to allow requests from the frontend (React Native Expo)
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// MongoDB connection (make sure MongoDB is running)
mongoose.connect('mongodb://localhost:27017/floodzones', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log('MongoDB connection error: ', err));

// Endpoint to get all flood zones
app.get('/api/flood-zones', async (req, res) => {
    try {
        const floodZones = await FloodZone.find(); // Fetch all flood zones from the DB
        res.json(floodZones);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching flood zones' });
    }
});

// Start the server on port 5000
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
