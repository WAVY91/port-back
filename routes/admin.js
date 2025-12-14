const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    let user = await User.findOne({ email });
    if (user) {
      user.password = password;
      await user.save();
      res.status(201).json({ message: 'Admin registered successfully' });
    } else {
      user = new User({ email, password });
      await user.save();
      res.status(201).json({ message: 'Admin registered successfully' });
    }
  } catch (error) {
    console.error('Admin register error:', error);
    res.status(500).json({ message: 'Error registering admin', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ message: 'Logged in successfully', token });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

router.get('/verify', authMiddleware, (req, res) => {
  res.json({ message: 'Token is valid', userId: req.user.id });
});

module.exports = router;
