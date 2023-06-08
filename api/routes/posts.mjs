import express from 'express';
import db from '../db/conn.mjs';
import parseRedditJson from '../parse/parsing.mjs';
import parseByType from '../parse/reparse.mjs';
export const postsRouter = express.Router();

const postsCollection = db.collection('posts');

// Get most recent posts from db
postsRouter.get('/', async (req, res) => {
  console.log('GET: /posts');
  let results = await postsCollection
    .find({})
    .sort({ created: -1 })
    .limit(250) // TODO: pagination
    .toArray();

  if (results.length > 0) {
    res.send(results);
  } else {
    console.log('Error getting posts from db');
    res.status(500);
    res.send([]);
  }
});

postsRouter.get('/filter/:type', async (req, res) => {
  console.log(req.params.type);
  let results = await postsCollection
    .find({ type: req.params.type })
    .sort({ created: -1 })
    .limit(50)
    .toArray();

  res.send(results);
});

postsRouter.get('/posts/:postId', (req, res) => {
  const postId = req.params.postId;
  res.send('posts GET id=' + postId);
});

postsRouter.get('/reparse/:type', async (req, res) => {
  // Reparse the details for chosen category
  // type: url param of post type
  // limit: query param for how many posts to reparse, default=10, max=500
  // e.g. /reparse/monitor?limit=25
  const type = req.params.type;
  const limit = req.query.limit ? req.query.limit : 10;

  console.log(`Reparsing most recent ${limit} posts in category: ${type}`);

  // Get most recent chosen type posts
  const results = await postsCollection
    .find({ type: req.params.type })
    .sort({ created: -1 })
    .limit(parseInt(limit))
    .toArray();

  // Reparse the posts' details
  let reparsedResults = [];
  for (let post of results) {
    reparsedResults.push(parseByType(type, post));
  }

  let bulkUpdates = [];
  for (let post of reparsedResults) {
    bulkUpdates.push({
      updateOne: {
        filter: { id: post.id },
        update: {
          $set: {
            detail: post.detail,
          },
        },
      },
    });
  }
  const result = await postsCollection.bulkWrite(bulkUpdates);

  console.log(`Done reparsing ${limit} posts in category: ${type}`);

  res.send(bulkUpdates);
});
