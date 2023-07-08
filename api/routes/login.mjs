import express from 'express';
import db from '../db/conn.mjs';
import jwt from 'jsonwebtoken';
export const loginRouter = express.Router();

const usersCollection = db.collection('users');

// User login
loginRouter.post('/auth', async (req, res) => {
  console.log('POST: /login/auth');
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
loginRouter.post('/auth', async (req, res) => {
  // TODO
});

// Logout current user
loginRouter.get('/logout', (req, res) => {
  // TODO
});

loginRouter.post('/', (req, res) => {
  const { username, password } = req.body;
  console.log(`${username} is trying to login ..`);

  // if (username === 'admin' && password === 'admin') {
  //   return res.json({
  //     token: jsonwebtoken.sign({ user: 'admin' }, process.env.JWT_SECRET),
  //   });
  // }

  return res
    .status(401)
    .json({ message: 'The username and password your provided are invalid' });
});

loginRouter.get('/secret', (req, res) => {
  return res.status(401).json({ message: 'you need to login first' });
});
