const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

const User = require('../models/User');

// ===============================
// REGISTER (with email verification)
// ===============================
router.post('/register', async (req, res) => {
  const { name, email, password, role, phone, location } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    // Rescuer must provide phone
    if (role === 'rescuer' && !phone) {
      return res.status(400).json({ msg: 'Rescuer must provide phone number' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate email verification token
    const emailToken = crypto.randomBytes(32).toString('hex');

    const userData = {
      name,
      email,
      password: hashedPassword,
      role: role === 'rescuer' ? 'rescuer' : 'user',
      emailVerificationToken: emailToken,
      emailVerificationExpires: Date.now() + 24 * 60 * 60 * 1000 // 24h
    };

    if (role === 'rescuer') userData.phone = phone;
    if (location && location.lat && location.lng) {
      userData.location = { type: 'Point', coordinates: [location.lng, location.lat] };
    }

    user = new User(userData);
    await user.save();

    // Send verification email
    const verifyLink = `http://localhost:5000/api/auth/verify-email/${emailToken}`;
    await sendEmail(
      email,
      'Verify your email',
      `<h3>Email Verification</h3>
       <p>Click the link below to verify your account:</p>
       <a href="${verifyLink}">${verifyLink}</a>`
    );

    res.json({ msg: 'Registration successful. Please verify your email.' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===============================
// VERIFY EMAIL
// ===============================
router.get('/verify-email/:token', async (req, res) => {
  try {
    const user = await User.findOne({
      emailVerificationToken: req.params.token,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ msg: 'Invalid or expired verification link' });

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;

    await user.save();

    res.json({ msg: 'Email verified successfully' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===============================
// LOGIN
// ===============================
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'User does not exist' });

    // Block unverified users
    if (!user.isEmailVerified) return res.status(403).json({ msg: 'Please verify your email first' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || null,
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
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'User does not exist' });

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 mins
    await user.save();

    const resetLink = `http://localhost:5000/reset-password/${resetToken}`;
    await sendEmail(
      email,
      'Reset Password',
      `<h3>Password Reset</h3>
       <p>Click the link below to reset your password:</p>
       <a href="${resetLink}">${resetLink}</a>`
    );

    res.json({ msg: 'Password reset link sent to email' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/reset-password', async (req, res) => {
  console.log("Reset-password route called");
  console.log("Request body:", req.body);

  const { token, newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    console.log("User found:", user);

    if (!user) return res.status(400).json({ msg: 'Invalid or expired token' });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ msg: 'Password successfully reset' });

  } catch (err) {
    console.error("Reset-password error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
