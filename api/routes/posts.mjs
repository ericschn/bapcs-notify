import express from 'express';
import db from '../db/conn.mjs';
import parseRedditJson from '../parse/parsing.mjs';
export const postsRouter = express.Router();

const postsCollection = db.collection('posts');

// Get most recent posts from db
postsRouter.get('/', async (req, res) => {
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

postsRouter.get('/filter/:type', async (req, res) => {
  console.log(req.params.type);
  let results = await postsCollection
    .find({ type: req.params.type })
    .sort({ created: -1 })
    .limit(50)
    .toArray();

  res.send(results);
});

postsRouter.get('/posts/:postId', (req, res) => {
  const postId = req.params.postId;
  res.send('posts GET id=' + postId);
});
