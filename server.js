const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const floodRoutes = require('./routes/flood');
const helplineRouter = require('./routes/helplineRouter');
const emergencyRoutes = require('./routes/emergencyRoutes');
const rescueRoutes = require('./routes/rescue');
const test = require('./routes/res');
const requestApprovalRoutes = require('./routes/requestApproval');
const authRoutes = require('./routes/auth'); // ✅ Auth route for login/register

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Request logging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} - Body:`, req.body);
    next();
});

// Routes
app.use('/api/flood-zones', floodRoutes);
app.use('/api/helplines', helplineRouter);
app.use('/api/emergencies', emergencyRoutes);
app.use('/api/rescues', rescueRoutes);
app.use('/api/test', test);
app.use('/api/requests', requestApprovalRoutes);
app.use('/api/auth', authRoutes); // ✅ Auth route added

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch((err) => console.error('❌ Failed to connect to MongoDB:', err));

// Fallback for unknown routes
app.use((req, res, next) => {
    console.log(`🚫 Unmatched route: ${req.method} ${req.url}`);
    res.status(404).json({ error: 'Route not found' });
});

// List active routes (for debugging)
app._router.stack.forEach((middleware) => {
    if (middleware.route) {
        console.log(`➡️ Route: ${middleware.route.path} - Methods: ${Object.keys(middleware.route.methods).join(', ')}`);
    }
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('🔥 Global Error:', err.stack);
    res.status(500).json({ error: err.message });
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
