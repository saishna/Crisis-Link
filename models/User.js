const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },

  email: { type: String, required: true, unique: true },

  password: { type: String, required: true },

  role: { 
    type: String, 
    enum: ['user', 'rescuer'], 
    default: 'user' 
  },

  // Only needed for rescuers
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: undefined
    }
  },

  resetPasswordToken: String,
  resetPasswordExpires: Date
});

// For geo queries
UserSchema.index({ location: "2dsphere" });

module.exports = mongoose.model('User', UserSchema);
