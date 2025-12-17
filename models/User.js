const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    unique: true,
    sparse: true // ✅ allows multiple null emails
  },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'rescuer'], default: 'user' },
  location: {
    type: { type: String, enum: ['Point'], required: function() { return this.role === 'rescuer'; } },
    coordinates: { type: [Number], required: function() { return this.role === 'rescuer'; } }
  },
  otp: String,
  otpExpires: Date,
  isVerified: { type: Boolean, default: false },
  resetPasswordToken: String,
  resetPasswordExpires: Date
});

// Geospatial index for rescuer
UserSchema.index({ location: '2dsphere' });

// Sparse unique index for email
UserSchema.index({ email: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('User', UserSchema);
