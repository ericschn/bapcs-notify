const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 3000;

let prevRedditJson = null;

app.use(cors());

app.get('/', (req, res) => {
  res.send('API running');
});

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

app.listen(port, () => {
  console.log(`API running on port ${port}`);
});

// Helper functions

function compareRedditJson(a, b) {
  // TODO: error checking
  if (!a || !b) return false;
  if (a[0].data.title === b[0].data.title) return true;
}

function parseRedditJson(posts) {
  let result = [];
  for (let post of posts) {
    result.push(post.data.title);
  }
  return result;
}
