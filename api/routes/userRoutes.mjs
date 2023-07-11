import express from 'express';
import db from '../db/conn.mjs';
import jwt from 'jsonwebtoken';
export const userRouter = express.Router();

const usersCollection = db.collection('users');

// User login
userRouter.post('/auth', async (req, res) => {
  console.log('POST: /user/auth');
  const { email, password } = req.body;
  const user = await usersCollection.findOne({ email });

  if (user && user.password === password) {
    // TODO: bcrypt
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
userRouter.post('/register', async (req, res) => {
  console.log('POST: /user/register');

  const { email, phone, password } = req.body;

  try {
    // Validate email
    if (!email || !email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,8}$/)) {
      throw new Error('bad email');
    }

    // Validate password
    if (!password || !password.match(/^[\w\d!\@\#\$\%\^\&\*\?]{8,128}$/)) {
      throw new Error('bad password');
    }

    // Validate phone
    if (!phone) {
      phone = 0;
    } else if (phone.toString().length !== 10) {
      throw new Error('bad phone');
    }

    // Validate notification settings
    // TODO

    // Check for existing user
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) throw new Error('user already exists');

    // Add new user to db
    // TODO

    // Make a cookie
    // TODO

    res.json({
      email: email,
      phone: phone,
      password: password,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Logout current user
userRouter.get('/logout', (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'User successfully logged out' });
});
