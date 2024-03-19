import express from 'express';
import axios from 'axios';
import db from '../db/conn.js';
import parseRedditJson from '../parse/parsing.js';
export const workerRouter = express.Router();

const postsCollection = db.collection('posts');

// Main worker job, runs every minute
// Gets 100 posts, adds new posts and updates existing
// /api/v1/worker/update
workerRouter.get('/update', async (req, res) => {
  let response = '';
  const redditNew = await getRedditNew(100);

  if (!redditNew[0]) {
    // Reddit server error
    response = '-1';
    res.status(500).send(response);
    return;
  }

  // Get most recent 50 posts from db
  const dbPosts = await postsCollection
    .find({})
    .sort({ created: -1 })
    .limit(50)
    .toArray();

  // Check for duplicates and add new posts
  let newJsonToAdd = checkDuplicates(redditNew, dbPosts);
  if (newJsonToAdd.length > 0) {
    const posts = parseRedditJson(newJsonToAdd);
    await postsCollection.insertMany(posts, {});
    response = '1';
  } else {
    response = '0';
  }

  // Update existing database posts
  let bulkUpdates = [];
  for (let redditPost of redditNew) {
    bulkUpdates.push({
      updateOne: {
        filter: { id: redditPost.data.id },
        update: {
          $set: {
            expired: redditPost.data.link_flair_css_class === 'expired',
            upvotes: redditPost.data.ups,
          },
        },
      },
    });
  }
  const result = await postsCollection.bulkWrite(bulkUpdates);

  res.send(response);
});

// Test if reddit can be accessed
workerRouter.get('/test', async (req, res) => {
  const bapcsUrl = 'https://old.reddit.com/r/buildapcsales/new/.json?raw_json=1';
  try {
    let result = await axios.get(`${bapcsUrl}`, {
      timeout: 6000,
      headers: {
        'accept-encoding': '*',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246',
      },
    });
    const data = result.data;
    // TODO: data processing for reddit error
    res.send(data);
  } catch (error) {
    console.error('API /test ERROR: ' + error);
    res.send('error');
  }
})

// Admin function
// Populates empty database
workerRouter.get('/populate-empty', async (req, res) => {
  const prelimAfter = '11kp20w'; // null or 12mbk9a etc...
  let redditNew = await getRedditNew(100, prelimAfter);
  res.send(redditNew);
  let after = '';
  try {
    after = redditNew[redditNew.length - 1].data.id;
  } catch (err) {
    console.log(err);
    return;
  }
  for (let i = 0; i < 6; i++) {
    console.log('after: ' + after);
    let redditNext = await getRedditNew(100, after);
    res.send(redditNext);
    try {
      after = redditNext[redditNext.length - 1].data.id;
    } catch (err) {
      console.log(err);
      return;
    }

    redditNew = redditNew.concat(redditNext);
  }

  const posts = parseRedditJson(redditNew);
  const insertResult = await postsCollection.insertMany(posts, {});
  console.log(`${insertResult.insertedCount} documents were inserted`);
  res.send(insertResult);
});

// Admin function
// Monitor testing, delete all monitor posts from n days ago and re-parses
workerRouter.get('/monitor', async (req, res) => {
  // Get time in epoch seconds 6 days ago
  const tenDaysAgo = Math.floor(Date.now() / 1000) - 518400;

  const deleteResult = await postsCollection.deleteMany({
    type: 'monitor',
    created: { $gt: tenDaysAgo },
  });

  console.log(deleteResult);

  const dbMonitors = await postsCollection
    .find({ type: 'monitor' })
    .sort({ created: -1 })
    .limit(20)
    .toArray();

  let redditNew = await getRedditSearch('monitor');

  const posts = parseRedditJson(redditNew);

  // Check if monitor post is in db before inserting
  let nonDupePosts = [];
  for (let post of posts) {
    let dupe = false;
    for (let dbPost of dbMonitors) {
      if (post.id === dbPost.id) {
        dupe = true;
        break;
      }
    }
    if (!dupe) {
      nonDupePosts.push(post);
    }
  }

  const insertResult = await postsCollection.insertMany(nonDupePosts, {});
  console.log(`${insertResult.insertedCount} documents were inserted`);
  res.send(insertResult.insertedCount.toString());
});

// TODO: Admin job: flip bool on posts with type: expired
workerRouter.get('/fix-expired', async (req, res) => {
  // TODO
  res.send('yay');
});

//
// Helper functions
//

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
// limit = number of posts to return, default 25, max 100 - removed for bot detection
async function getRedditNew(limit = 25, after = null) {
  const bapcsUrl = 'https://reddit.com/r/buildapcsales/new/.json?raw_json=1';
  try {
    let result = await axios.get(`${bapcsUrl}`, {
      timeout: 6000,
      headers: {
        'accept-encoding': '*',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246',
      },
    });
    return result.data.data.children;
  } catch (error) {
    console.error('API /fetch-new ERROR: ' + error);
    return [null, error];
  }
}

async function getRedditSearch(type, limit = 25, after = null) {
  const bapcsUrl =
    'https://reddit.com/r/buildapcsales/search.json?raw_json=1&restrict_sr=on&sort=new&q=flair%3A';
  let afterStr = '';
  try {
    if (after !== null) {
      afterStr = `&after=t3_${after}`;
    }
    let result = await axios.get(
      `${bapcsUrl}${type}${afterStr}&limit=${limit}`,
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
