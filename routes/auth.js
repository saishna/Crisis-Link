const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const sendEmail = require('../utils/sendEmail');
const User = require('../models/User');

// ===============================
// HELPERS
// ===============================

// Generate OTP
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// Validate Nepal phone number
const isValidPhone = (phone) => /^98\d{8}$/.test(phone);

// ===============================
// SEND SMS (FIXED)
// ===============================
const sendSMS = async (phone, message) => {
  try {
    console.log("🔑 TOKEN:", process.env.SPARROW_API_TOKEN);

    if (!process.env.SPARROW_API_TOKEN) {
      throw new Error("Sparrow API token missing");
    }

    if (!isValidPhone(phone)) {
      throw new Error("Invalid Nepal phone number");
    }

    const params = new URLSearchParams();
    params.append('token', process.env.SPARROW_API_TOKEN.trim()); // ✅ fix
    params.append('from', 'Demo'); // ✅ IMPORTANT (not Demo)
    params.append('to', phone);
    params.append('text', message);

    const response = await axios.post(
      'https://api.sparrowsms.com/v2/sms/',
      params,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    console.log("✅ SMS RESPONSE:", response.data);

    if (response.data.response_code !== 200) {
      throw new Error(response.data.response);
    }

  } catch (err) {
    console.error("❌ SMS FAILED:", err.response?.data || err.message);
  }
};

// ===============================
// REGISTER
// ===============================
router.post('/register', async (req, res) => {
  const { name, email, phone, password, role, location } = req.body;

  try {
    if (!phone) return res.status(400).json({ msg: 'Phone required' });
    if (!isValidPhone(phone))
      return res.status(400).json({ msg: 'Invalid phone number' });

    const existingUser = await User.findOne({
      $or: [{ phone }, email ? { email } : null].filter(Boolean)
    });

    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();

    const userData = {
      name,
      phone,
      password: hashedPassword,
      role,
      otp,
      otpExpires: Date.now() + 10 * 60 * 1000,
      isVerified: false
    };

    if (email) userData.email = email;

    if (role === 'rescuer' && location?.lat && location?.lng) {
      userData.location = {
        type: 'Point',
        coordinates: [location.lng, location.lat]
      };
    }

    const user = new User(userData);
    await user.save();

    // ✅ Send OTP via SMS
    await sendSMS(phone, `Your OTP is ${otp}`);

    // ✅ Send Email (optional)
    if (email) {
      await sendEmail(email, 'Verification OTP', `<h3>OTP: ${otp}</h3>`);
    }

    res.json({ msg: 'User registered. OTP sent to phone.' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===============================
// VERIFY OTP
// ===============================
router.post('/verify-otp', async (req, res) => {
  const { phone, otp } = req.body;

  try {
    const user = await User.findOne({
      phone,
      otp,
      otpExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ msg: 'Invalid or expired OTP' });

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({ msg: 'OTP verified successfully' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===============================
// LOGIN
// ===============================
router.post('/login', async (req, res) => {
  const { email, phone, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ phone }, email ? { email } : null].filter(Boolean)
    });

    if (!user) return res.status(400).json({ msg: 'User not found' });
    if (!user.isVerified)
      return res.status(403).json({ msg: 'OTP not verified' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email || null,
        phone: user.phone,
        role: user.role,
        location: user.location || null
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===============================
// FORGOT PASSWORD
// ===============================
router.post('/forgot-password', async (req, res) => {
  const { email, phone } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ phone }, email ? { email } : null].filter(Boolean)
    });

    if (!user) return res.status(400).json({ msg: 'User not found' });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendSMS(user.phone, `Reset OTP: ${otp}`);

    if (user.email) {
      await sendEmail(user.email, 'Password Reset OTP', `<h3>${otp}</h3>`);
    }

    res.json({ msg: 'Password reset OTP sent' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===============================
// RESET PASSWORD
// ===============================
router.post('/reset-password', async (req, res) => {
  const { phone, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({
      phone,
      otp,
      otpExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ msg: 'Invalid or expired OTP' });

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({ msg: 'Password reset successful' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;