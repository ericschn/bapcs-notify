import express from 'express';
import axios from 'axios';
import db from '../db/conn.mjs';
import parseRedditJson from '../parse/parsing.mjs';
const router = express.Router();

const postsCollection = db.collection('posts');

// state
let prevRedditJson = null;

// Get the 25 posts from bapcs/new
router.get('/', async (req, res) => {
  let newRedditJson = null;

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
        return;
      }

      if (prevRedditJson === null) {
        // App was restarted, get posts from db for comparison
        console.log('App restart detected');
        prevRedditJson = newRedditJson;
        const dbPosts = await postsCollection.find({}).sort({ created: -1 }).limit(50).toArray();

        // Loop posts from reddit json and only insert what's new
        let newJsonToAdd = checkDuplicates(newRedditJson, dbPosts);
        newRedditJson = newJsonToAdd;
      }

      if (newRedditJson.length > 0) {
        prevRedditJson = newRedditJson;
        const posts = parseRedditJson(newRedditJson);
        const insertResult = await postsCollection.insertMany(posts, {});
        console.log(`${insertResult.insertedCount} documents were inserted`);
        res.send(insertResult);
      } else {
        console.log(`0 documents were inserted`);
        res.send('no new posts found');
      }
    })
    .catch((error) => {
      // TODO: better error handling
      console.error('API /fetch-new ERROR: ' + error);
      res.send('Error getting json from reddit: ' + error).status(500);
    });
});

// Helper functions
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

export default router;
