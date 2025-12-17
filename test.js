const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const User = require('../models/User');

// Helper: OTP generator
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// ===============================
// REGISTER
// ===============================
router.post('/register', async (req, res) => {
  const { name, email, phone, password, role, location } = req.body;

  try {
    if (!phone) return res.status(400).json({ msg: 'Phone number is required' });

    if (role === 'rescuer') {
      if (!location?.lat || !location?.lng)
        return res.status(400).json({ msg: 'Location is required for rescuer' });
    }

    // Check existing user
    const existingUser = await User.findOne({
      $or: [{ phone }, email ? { email } : null].filter(Boolean)
    });

    if (existingUser) return res.status(400).json({ msg: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();

    const userData = {
      name,
      phone,
      password: hashedPassword,
      role,
      otp,
      otpExpires: Date.now() + 10 * 60 * 1000, // 10 minutes
      isVerified: false
    };

    if (email) userData.email = email;
    if (role === 'rescuer') userData.location = { type: 'Point', coordinates: [location.lng, location.lat] };

    const user = new User(userData);
    await user.save();

    // Send OTP to phone
    console.log(`OTP sent to phone ${phone}: ${otp}`);
    // TODO: integrate real SMS provider

    // Send OTP to email if provided
    if (email) {
      await sendEmail(email, 'Verification OTP', `<h3>Your OTP is ${otp}</h3><p>Valid for 10 minutes</p>`);
    }

    res.json({
      msg: email
        ? 'Registration successful. OTP sent to phone and email.'
        : 'Registration successful. OTP sent to phone.',
      otp // for testing only
    });
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

    if (!user) return res.status(400).json({ msg: 'User does not exist' });
    if (!user.isVerified) return res.status(403).json({ msg: 'Please verify OTP first' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

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
// FORGOT PASSWORD (Send OTP)
// ===============================
router.post('/forgot-password', async (req, res) => {
  const { email, phone } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ phone }, email ? { email } : null].filter(Boolean)
    });

    if (!user) return res.status(400).json({ msg: 'User does not exist' });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // Send OTP to phone
    console.log(`Forgot-password OTP sent to phone ${user.phone}: ${otp}`);
    // TODO: integrate real SMS provider

    // Send OTP to email if available
    if (user.email) {
      await sendEmail(user.email, 'Password Reset OTP', `<h3>Your OTP is ${otp}</h3><p>Valid for 10 minutes</p>`);
    }

    res.json({
      msg: 'Password reset OTP sent to phone and email (if available)',
      otp // for testing only
    });
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
