import express from 'express';
import axios from 'axios';
import db from '../db/conn.mjs';
import parseRedditJson from '../parse/parsing.mjs';
export const fetchNewRouter = express.Router();

const postsCollection = db.collection('posts');

// STATE NOT RELIABLE - data can change if post becomes deleted
// maybe switch to looking at time posted combined with reddit id
let prevRedditJson = null;

// Get the 25 posts from bapcs/new and add new posts to db
fetchNewRouter.get('/', async (req, res) => {
  console.log('GET: /fetch-new');
  const newRedditJson = await getRedditNew();
  if (!newRedditJson[0]) {
    res.status(500);
    res.send('Cannot get reddit json: ' + newRedditJson[1]);
    return;
  }

  if (compareRedditJson(prevRedditJson, newRedditJson)) {
    console.log('No new posts since last check');
    res.send('No new posts since last check');
    return;
  }

  prevRedditJson = newRedditJson;
  const dbPosts = await postsCollection
    .find({})
    .sort({ created: -1 })
    .limit(50)
    .toArray();

  // Loop posts from reddit json and only insert what's new
  let newJsonToAdd = checkDuplicates(newRedditJson, dbPosts);

  if (newJsonToAdd.length > 0) {
    const posts = parseRedditJson(newJsonToAdd);
    const insertResult = await postsCollection.insertMany(posts, {});
    console.log(`${insertResult.insertedCount} documents were inserted`);
    res.send(insertResult);
  } else {
    console.log(`0 documents were inserted`);
    res.send('No new posts found');
  }
});

fetchNewRouter.get('/populate-empty', async (req, res) => {
  res.send('populate empty db');
});

// gets 100 posts from reddit and updates matching db posts with
// upvotes and if it's expired
fetchNewRouter.get('/update', async (req, res) => {
  const redditNew = await getRedditNew(100);
  let results = [];
  for (let redditPost of redditNew) {
    const result = await postsCollection.updateOne(
      { id: redditPost.data.id },
      {
        $set: {
          expired: redditPost.data.link_flair_css_class === 'expired',
          upvotes: redditPost.data.ups,
        },
      }
    );
    results.push(result);
  }

  res.send(results.length + ' documents updated');
});

// Helper functions

// Catch up db after app was restarted
export async function initializeApp() {
  // Initialization after app restart
  // get created time of most recent post in db
  console.log('App initialization start');
  let mostRecentDbPost = await postsCollection
    .find({})
    .sort({ created: -1 })
    .limit(1)
    .toArray();
  if (mostRecentDbPost.length === 0) {
    mostRecentDbPost = [{ created: 0, id: 0 }];
  }
  const mostRecentDbPostTime = mostRecentDbPost[0].created;

  // get 100 from new and truncate array before that time
  const newRedditJson = sortRedditJson(await getRedditNew(100));
  if (!newRedditJson[0]) {
    console.log('Initialization failure: cannot get reddit json');
    return;
  }

  let postsToAdd = [];
  for (let redditPost of newRedditJson) {
    if (
      redditPost.data.created < mostRecentDbPostTime ||
      redditPost.data.id === mostRecentDbPost[0].id
    ) {
      break;
    }
    postsToAdd.push(redditPost);
  }

  if (postsToAdd.length > 0) {
    const posts = parseRedditJson(postsToAdd);
    const insertResult = await postsCollection.insertMany(posts, {});
    console.log(
      `Initialization complete: ${insertResult.insertedCount} documents inserted`
    );
  } else {
    console.log('Initialization complete: no new documents were inserted');
  }
}

// Gets newest posts from reddit.com/r/buildapcsales
// limit = number of posts to return, default 25, max 100
async function getRedditNew(limit = 25) {
  try {
    let result = await axios.get(
      `https://www.reddit.com/r/buildapcsales/new/.json?raw_json=1&limit=${limit}`,
      {
        timeout: 6000,
        headers: { 'accept-encoding': '*' },
      }
    );
    return result.data.data.children;
  } catch (error) {
    console.error('API /fetch-new ERROR: ' + error);
    return [null, error];
  }
}

function compareRedditJson(a, b) {
  // TODO: error checking
  if (!a || !b) return false;
  if (a[0].data.id === b[0].data.id) return true;
}

function checkDuplicates(newArr, oldArr) {
  let newJsonArr = [];
  for (let newPost of newArr) {
    for (let oldPost of oldArr) {
      if (newPost.data.id === oldPost.id) {
        return newJsonArr;
      }
    }
    newJsonArr.push(newPost);
  }
}

function sortRedditJson(redditJson) {
  redditJson.sort((a, b) => b.data.created - a.data.created);
  console.log('sorting reddit data');
  return redditJson;
}
