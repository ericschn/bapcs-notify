import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import axios from 'axios';
import db from './db/conn.mjs';
import parseRedditJson from './parse/parsing.mjs';

const app = express();
const port = 3000;

const postsCollection = db.collection('posts');

// state
let prevRedditJson = null;

app.use(cors());

app.get('/', (req, res) => {
  res.send('API');
});

// Get the 25 posts from bapcs/new
app.get('/fetch-new', async (req, res) => {
  let newRedditJson = null;

  if (prevRedditJson === null) {
    // App was restarted, get posts from db for comparison
    const dbPosts = await postsCollection.find({}).limit(50).toArray();
  }

  axios
    .get('https://www.reddit.com/r/buildapcsales/new/.json?raw_json=1', {
      timeout: 6000,
      headers: { 'accept-encoding': '*' },
    })
    .then(async (axiosRes) => {
      newRedditJson = axiosRes.data.data.children;
      if (compareRedditJson(prevRedditJson, newRedditJson)) {
        console.log('No new posts since last check');
        res.send('no new posts found');
      } else {
        prevRedditJson = newRedditJson;
        const posts = parseRedditJson(newRedditJson);
        const insertResult = await postsCollection.insertMany(posts, {});
        console.log(`${insertResult.insertedCount} documents were inserted`);
        res.send(insertResult);
      }
    })
    .catch((error) => {
      // TODO: better error checking
      console.error('API /fetch-new ERROR: ' + error);
      res.send('Error getting json from reddit: ' + error).status(500);
    });
});

// Get most recent 50 posts from db
app.get('/posts', async (req, res) => {
  let results = await postsCollection.find({}).limit(50).toArray();

  res.send(results).status(200);
});

app.get('/posts/:postId', (req, res) => {
  const postId = req.params.postId;
  res.send('posts GET id=' + postId);
});

app.listen(port, () => {
  console.log(`API running on port ${port}`);
});

// Helper functions

function compareRedditJson(a, b) {
  // TODO: error checking
  if (!a || !b) return false;
  if (a[0].data.title === b[0].data.title) return true;
}
