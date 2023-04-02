const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

let prevRedditJson = null;

app.get('/', (req, res) => {
  res.send('<h1>API running</h1>');
});

app.get('/fetch-new', (req, res) => {
  let newRedditJson = null;
  axios.get('https://www.reddit.com/r/buildapcsales/new/.json').then((axiosRes) => {
    newRedditJson = axiosRes.data.data.children;
    if (compareRedditJson(prevRedditJson, newRedditJson)) {
      console.log("Json already exists in memory, no processing needed");
    } else {
      console.log("Json has new data, parsing json now");
      // parse json
      prevRedditJson = newRedditJson;
    }
    res.send(prevRedditJson);
    parseRedditJson(prevRedditJson);
  });
  // res.send(redditJsonFetch);
});

app.listen(port, () => {
  console.log(`API running on port ${port}`);
});

function compareRedditJson(a, b) {
  if (!a || !b) return false;
  if (a[0].data.title === b[0].data.title) return true;
}

function parseRedditJson(posts) {
  let result = [];
  for (let post of posts) {
    result.push(post.data.title);
  }
  console.log(result);
}
