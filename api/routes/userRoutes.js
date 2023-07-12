import express from 'express';
import db from '../db/conn.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { protect } from '../middleware/authMiddleware.js';
export const userRouter = express.Router();

const usersDb = db.collection('users');

// User login
// POST /user/auth
userRouter.post('/auth', async (req, res) => {
  console.log('POST: /user/auth');
  const { email, password } = req.body;
  const user = await usersDb.findOne({ email });

  if (user && bcrypt.compareSync(password, user.password)) {
    const userId = user._id;
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.json({
      _id: user._id,
      email: user.email,
      favorites: user.favorites,
    });
  } else {
    res.status(401).json({ error: 'invalid credentials' });
  }
});

// Register new user
// POST /user/register
userRouter.post('/register', async (req, res) => {
  console.log('POST: /user/register');

  const { email, phone, password } = req.body;

  try {
    // Validate email
    if (!email || !email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,8}$/)) {
      throw new Error('invalid email');
    }

    // Validate password
    if (!password || !password.match(/^[\w\d!\@\#\$\%\^\&\*\?]{8,128}$/)) {
      throw new Error('invalid password');
    }

    // Validate phone
    if (!phone) {
      phone = 0;
    } else if (phone.toString().length !== 10) {
      throw new Error('invalid phone');
    }

    // Validate notification settings
    // TODO

    // Check for existing user
    const existingUser = await usersDb.findOne({ email });
    if (existingUser) throw new Error('user already exists');

    // Add new user to db
    const hashedPass = hashPassword(password);
    await usersDb.insertOne({
      email: email,
      phone: phone,
      password: hashedPass,
    });
    // TODO

    // Eventually require verification email before letting user login
    // TODO

    res.status(201).json({
      email: email,
      phone: phone,
      password: hashedPass,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Logout current user
// GET /user/logout
userRouter.get('/logout', (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'User successfully logged out' });
});

// User profile
// GET /user/profile
userRouter.route('/profile').get(protect, (req, res) => {
  res.json(req.user);
});

// Helper functions

function hashPassword(pass) {
  const salt = bcrypt.genSaltSync();
  return bcrypt.hashSync(pass, salt);
}
