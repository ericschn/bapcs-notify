import express from 'express';
import db from '../db/conn.mjs';
import jsonwebtoken from 'jsonwebtoken';
export const loginRouter = express.Router();

const postsCollection = db.collection('posts');

// Get login info
loginRouter.get('/', async (req, res) => {
  console.log('GET: /posts');
  let results = await postsCollection
    .find({})
    .sort({ created: -1 })
    .limit(1000) // TODO: not 1000
    .toArray();

  if (results.length > 0) {
    res.send(results);
  } else {
    console.log('Error getting posts from db');
    res.status(500);
    res.send([]);
  }
});

loginRouter.post('/', (req, res) => {
  const { username, password } = req.body;
  console.log(`${username} is trying to login ..`);

  if (username === 'admin' && password === 'admin') {
    return res.json({
      token: jsonwebtoken.sign({ user: 'admin' }, process.env.JWT_SECRET),
    });
  }

  return res
    .status(401)
    .json({ message: 'The username and password your provided are invalid' });
});

loginRouter.get('/secret', (req, res) => {
  return res.status(401).json({ message: 'you need to login first' });
});
