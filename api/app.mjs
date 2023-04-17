import express from 'express';
import cors from 'cors';
import db from './db/conn.mjs';
import fetchNew from './routes/fetch-new.mjs';

const app = express();
const port = 3000;
const postsCollection = db.collection('posts');

// Initialization after app restart
// get created time of most recent post in db
// get 25 from new and truncate array before that time
// if all 25 posts are more recent, grab next page and try
// try for 4 pages, add posts to db
// ?limit=100 gets 100 results, usually 5 days worth of posts

app.use(cors());

app.use('/fetch-new', fetchNew);

app.get('/', (req, res) => {
  res.send('API');
});

// Get most recent 50 posts from db
app.get('/posts', async (req, res) => {
  let results = await postsCollection.find({}).sort({ created: -1 }).limit(50).toArray();
  res.send(results).status(200);
});

app.get('/posts/:postId', (req, res) => {
  const postId = req.params.postId;
  res.send('posts GET id=' + postId);
});

app.listen(port, () => {
  console.log(`API running on port ${port}`);
});
