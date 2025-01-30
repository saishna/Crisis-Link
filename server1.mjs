import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
// const emergencyRoutes = require('./routes/emergencyRoutes');


// Import your route files
import floodRoutes from './routes/flood.js';
import helplineRouter from './routes/helplineRouter.js';
import emergencyRoutes from './routes/emergencyRoutes.js';
import helpline from './routes/helpline.js';

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
app.use('/api/helplines', helplineRouter); // Register helpline routes
app.use('/api/emergencies', emergencyRoutes);
app.use('/api', helpline);

// Push notification endpoint
app.post('/api/push-notifications', async (req, res) => {
    const { expoPushToken, title, body, data } = req.body;

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
        // Use the built-in fetch function
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

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Failed to connect to MongoDB:', err));

// Handle unmatched routes
app.use((req, res, next) => {
    console.log(`Unmatched route: ${req.method} ${req.url}`);
    res.status(404).json({ error: 'Route not found' });
});

// Check active routes
app._router.stack.forEach((middleware) => {
    if (middleware.route) {
        console.log(`Route: ${middleware.route.path} - Methods: ${Object.keys(middleware.route.methods).join(', ')}`);
    }
});

// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
