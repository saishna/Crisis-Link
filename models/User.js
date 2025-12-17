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

  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: function () {
        return this.role === 'rescuer';
      }
    },
    coordinates: {
      type: [Number], // [lng, lat]
      required: function () {
        return this.role === 'rescuer';
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
  resetPasswordExpires: Date,

  // Email verification
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,

  // Email OTP
  emailOTP: String,
  emailOTPExpires: Date
});

// Only apply geospatial index if location exists
UserSchema.index({ location: "2dsphere" });

module.exports = mongoose.model('User', UserSchema);
