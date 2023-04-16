import express from 'express';
import cors from 'cors';
import db from './db/conn.mjs';
import fetchNew from './routes/fetch-new.mjs';

const app = express();
const port = 3000;
const postsCollection = db.collection('posts');

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
