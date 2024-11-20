const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const floodRoutes = require('./routes/flood'); // Import flood routes

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json()); // Parse JSON request bodies

// Routes
app.use('/api/flood-zones', floodRoutes); // Use flood routes

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/crisislink', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Failed to connect to MongoDB', err));

// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
