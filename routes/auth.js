const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const User = require('../models/User');

// REGISTER
router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);

        user = new User({
            name,
            email,
            password: hashedPassword,
            role: role === 'rescuer' ? 'rescuer' : 'user'
        });

        await user.save();

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'User does not exist' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// FORGOT PASSWORD
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'User does not exist' });

        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 mins

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetTokenExpiry;
        await user.save();

        // For testing: return token
        res.json({ msg: 'Reset token generated', resetToken });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// RESET PASSWORD
router.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) return res.status(400).json({ msg: 'Invalid or expired token' });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.json({ msg: 'Password successfully reset' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
