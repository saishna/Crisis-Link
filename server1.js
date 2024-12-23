const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const floodRoutes = require('./routes/flood'); // Import flood routes
const helplineRouter = require('./routes/helplineRouter'); // Import helpline router
const emergencyRoutes = require('./routes/emergencyRoutes');
const helpline = require('./routes/helpline');
const fetch = require('node-fetch'); // For sending push notifications

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
app.use('/api/emergencies', emergencyRoutes);
app.use('/api', helpline);

// Push notification endpoint
app.post('/api/push-notifications', async (req, res) => {
    const { expoPushToken, title, body, data } = req.body;

    // Validate the request body
    if (!expoPushToken || !title || !body) {
        return res.status(400).json({ error: 'Missing required fields: expoPushToken, title, body.' });
    }

    const message = {
        to: expoPushToken,
        sound: 'default',
        title: title,
        body: body,
        data: data || {},
    };

    try {
        // Send push notification via Expo Push API
        const response = await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });

        const result = await response.json();
        console.log('Push notification result:', result);

        if (result.data.status === 'ok') {
            res.status(200).json({ success: true, message: 'Notification sent successfully.', result });
        } else {
            res.status(500).json({ success: false, message: 'Failed to send notification.', result });
        }
    } catch (error) {
        console.error('Error sending push notification:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

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

// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
