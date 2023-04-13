import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import axios from 'axios';
import db from './db/conn.mjs';

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
app.get('/fetch-new', (req, res) => {
  let newRedditJson = null;

  axios
    .get('https://www.reddit.com/r/buildapcsales/new/.json', { timeout: 6000 })
    .then((axiosRes) => {
      newRedditJson = axiosRes.data.data.children;
      if (compareRedditJson(prevRedditJson, newRedditJson)) {
        console.log('No new posts since last check');
      } else {
        console.log('New post detected');
        // TODO: add parsing
        prevRedditJson = newRedditJson;
      }
      res.send(parseRedditJson(prevRedditJson));
    })
    .catch((error) => {
      // TODO: better error checking
      console.error('API GET ERROR: ' + error);
      res.status(500);
      res.send('Error getting reddit data: ' + error);
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

// Break these out into individual files
function parseRedditJson(posts) {
  let result = [];
  for (let post of posts) {
    let newPost = {
      id: post.data.id,
      created: post.data.created_utc,
      title: shortenRedditPostTitle(post.data.title),
      link: post.data.url,
      domain: post.data.domain,
      price: parsePrice(post.data.title),
      type: post.data.link_flair_css_class,
      detail: parseTypeDetail(post.data),
      reddit: parseRedditInfo(post.data),
    };

    result.push(newPost);
  }
  return result;
}

function shortenRedditPostTitle(title) {
  return title.replace(/\[.*\]/, '').replace(/[-\s–]*?\$.*$/, '');
}

function parsePrice(title) {
  return title.match(/\$\s?[\d\.,]+/)[0];
}

function parseTypeDetail(post) {
  const type = post.link_flair_css_class;
  switch (type.toLowerCase()) {
    // TODO: parsing for types
    case 'monitor':
      return { hz: 144, panel: 'ips' };
    case 'ram':
      return { ram_speed: 6400, ram_ddr: 'DDR5' };
    case 'cpu':
      return { cpu_brand: 'amd', cpu_cores: 16 };
    case 'gpu':
      return { gpu_brand: 'nvidia', gpu_memory: 12 };
    default:
      return null;
  }
}

function parseRedditInfo(post) {
  return {
    title: post.title,
    permalink: post.permalink,
    upvotes: post.ups,
    over_18: post.over_18,
    spoiler: post.spoiler,
    thumbnail: post.thumbnail,
  };
}
