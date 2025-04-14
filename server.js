const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const floodRoutes = require('./routes/flood'); // Import flood routes
const helplineRouter = require('./routes/helplineRouter'); // Import helpline router
const emergencyRoutes = require('./routes/emergencyRoutes');
const helpline = require('./routes/helpline');
const rescueRoutes = require('./routes/rescue'); // Import rescue routes
const test = require('./routes/res');
const requestApprovalRoutes = require('./routes/requestApproval');

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(bodyParser.json()); // Parse JSON request bodies

// Log incoming requests (for debugging)
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} - Body:`, req.body); // Log incoming requests
    next();
});

// Routes
app.use('/api/flood-zones', floodRoutes); // Use flood routes
app.use('/api/helplines', helplineRouter); // Register helpline routes
app.use('/api/emergencies', emergencyRoutes); // Register emergency routes
app.use('/api/rescues', rescueRoutes); // Register rescue routes
app.use('/api/test', test);
app.use('/api/requests', requestApprovalRoutes);
app.use('/api/helpline', helpline);



// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Failed to connect to MongoDB:', err));

// Handle unmatched routes (Debugging addition)
app.use((req, res, next) => {
    console.log(`Unmatched route: ${req.method} ${req.url}`);
    res.status(404).json({ error: 'Route not found' });
});

// Check active routes (Useful for debugging)
app._router.stack.forEach((middleware) => {
    if (middleware.route) { // Route handlers have a route property
        console.log(`Route: ${middleware.route.path} - Methods: ${Object.keys(middleware.route.methods).join(', ')}`);
    }
});

// Global Error Handler (logs full stack)
app.use((err, req, res, next) => {
    console.error('🔥 Global Error:', err.stack); // full stack trace
    res.status(500).json({ error: err.message });
});

// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
