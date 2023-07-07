import express from 'express';
import db from '../db/conn.mjs';
// import jsonwebtoken from 'jsonwebtoken';
export const loginRouter = express.Router();

const usersCollection = db.collection('users');

// Get login info
loginRouter.post('/auth', async (req, res) => {
  console.log('POST: /login/auth');
  const { email, password } = req.body;
  const user = await usersCollection.findOne({ email });

  if (user && user.password === password) {

    res.cookie('jwt', "testToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
      sameSite: 'strict', // Prevent CSRF attacks
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.json({
      _id: user._id,
      email: user.email,
      favorites: user.favorites,
    });
  } else {
    res.status(401).json({"error":"invalid credentials"});
  }
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
