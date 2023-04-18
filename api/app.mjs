import express from 'express';
import cors from 'cors';
import db from './db/conn.mjs';
import { fetchNewRouter, initializeApp } from './routes/fetch-new.mjs';
import { postsRouter } from './routes/posts.mjs';

const app = express();
const port = 3000;
const postsCollection = db.collection('posts');

initializeApp();

app.use(cors());

app.use('/fetch-new', fetchNewRouter);
app.use('/posts', postsRouter);

app.get('/', (req, res) => {
  res.send('API');
});

// Get most recent 50 posts from db
// app.get('/posts', async (req, res) => {
//   console.log('GET: /posts');
//   let results = await postsCollection
//     .find({})
//     .sort({ created: -1 })
//     .limit(500)
//     .toArray();


//     if (results.length > 0) {
//       res.send(results).status(200);
//     } else {
//       console.log('Error getting posts from db');
//       res.send([]);
//     }

// });

// app.get('/posts/:postId', (req, res) => {
//   const postId = req.params.postId;
//   res.send('posts GET id=' + postId);
// });

app.listen(port, () => {
  console.log(`API running on port ${port}`);
});
