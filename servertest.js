const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // ✅ MUST be at top

const floodRoutes = require('./routes/flood');
const helplineRouter = require('./routes/helplineRouter');
const emergencyRoutes = require('./routes/emergencyRoutes');
const rescueRoutes = require('./routes/rescue');
const nearbyRescuerRoutes = require('./routes/nearbyRescuer');
const test = require('./routes/res');
const requestApprovalRoutes = require('./routes/requestApproval');
const authRoutes = require('./routes/auth');
const nearbyHelplines = require('./routes/near');
const drainagerep = require('./routes/drainage');

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors());
app.use(express.json()); // ✅ ONLY this

// ✅ Logging AFTER parsing
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - Body:`, req.body);
  next();
});

// ✅ Routes
app.use('/api/flood-zones', floodRoutes);
app.use('/api/helplines', helplineRouter);
app.use('/api/emergencies', emergencyRoutes);
app.use('/api/rescues', rescueRoutes);
app.use('/api/nearby-rescuers', nearbyRescuerRoutes); // ✅ FIXED
app.use('/api/test', test);
app.use('/api/requests', requestApprovalRoutes);
app.use('/api/drainage', drainagerep);
app.use('/api/nearhelpline', nearbyHelplines);
app.use('/api/auth', authRoutes);

// ✅ MongoDB
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI)
.then(async () => {
  console.log('✅ Connected to MongoDB');
  await User.syncIndexes();
  console.log('✅ User indexes synced');
})
.catch(err => console.error('❌ MongoDB Error:', err));

// ✅ 404 handler
app.use((req, res) => {
  console.log(`🚫 Unmatched route: ${req.method} ${req.url}`);
  res.status(404).json({ error: 'Route not found' });
});

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error('🔥 Global Error:', err.stack);
  res.status(500).json({ error: err.message });
});

// ✅ Start server
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);