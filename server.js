const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const floodRoutes = require('./routes/flood'); // Import flood routes
const helplineRouter = require('./routes/helplineRouter'); // Import helpline router


dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(bodyParser.json()); // Parse JSON request bodies
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} - Body:`, req.body); // Log incoming requests
    next();
});

// Routes
app.use('/api/flood-zones', floodRoutes); // Use flood routes
app.use('/api/helplines', helplineRouter);  // Register helpline routes



// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Failed to connect to MongoDB', err));

// Handle unmatched routes
// Handle unmatched routes (Debugging addition)
app.use((req, res, next) => {
    console.log(`Unmatched route: ${req.method} ${req.url}`);
    res.status(404).json({ error: 'Route not found' });
});
// Check active routes
app._router.stack.forEach((middleware) => {
    if (middleware.route) { // Route handlers have a route property
        console.log(`Route: ${middleware.route.path} - Methods: ${Object.keys(middleware.route.methods)}`);
    }
});


// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
