const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ['user', 'rescuer'],
    default: 'user'
  },

  phone: {
    type: String,
    required: function () {
      return this.role === 'rescuer';
    }
  },

  // Location is optional for normal users
  // Required only for rescuers
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: function () {
        return this.role === 'rescuer';  // Only rescuer needs location.type
      }
    },
    coordinates: {
      type: [Number], // [lng, lat]
      required: function () {
        return this.role === 'rescuer';  // Only rescuer needs coordinates
      },
      validate: {
        validator: function (value) {
          if (this.role === 'rescuer') {
            return Array.isArray(value) && value.length === 2;
          }
          return true;
        },
        message: 'Rescuers must provide valid coordinates [longitude, latitude]'
      }
    }
  },

  resetPasswordToken: String,
  resetPasswordExpires: Date
});

// Only apply geospatial index if location exists
UserSchema.index({ location: "2dsphere" });

module.exports = mongoose.model('User', UserSchema);
