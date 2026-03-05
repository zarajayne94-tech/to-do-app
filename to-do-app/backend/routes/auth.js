// bcrypt

// JSON Web Tokens ( JWT )
// header.payload.signature

import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';

const router = express.Router();

// ===================================================================
// POST - User Signup
// ===================================================================

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // validation

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ error: 'Password must be at least 8 characters' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res
        .status(400)
        .json({ error: 'An account with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    const saved = await newUser.save();

    res.status(201).json({
      message: 'Account created successfully',
      user: { id: saved._id, name: saved.name, email: saved.email },
    });
  } catch (error) {
    res.status(500).json({ error: 'Error creating account' });
  }
});

// ===================================================================
// POST - User Login
// ===================================================================

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // JWT sign in - expires in 30 days

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email }, // payload
      process.env.SECRET_KEY,
      { expiresIn: '30d' },
    );

    res.json({
      message: 'Login successful',
      token: token,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
});

export default router;