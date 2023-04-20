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

app.listen(port, () => {
  console.log(`API running on port ${port}`);
});
