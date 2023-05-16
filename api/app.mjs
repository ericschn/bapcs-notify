import express from 'express';
import cors from 'cors';
import db from './db/conn.mjs';
import { fetchNewRouter, initializeApp } from './routes/fetch-new.mjs';
import { postsRouter } from './routes/posts.mjs';
import { loginRouter } from './routes/login.mjs';

const app = express();
const port = 3000;
const postsCollection = db.collection('posts');

initializeApp();

app.use(cors());

// IP whitelist
app.use((req, res, next) => {
  let validIps = [
    '::ffff:127.0.0.11',
    process.env.IP_LOCAL,
    process.env.IP_HOME,
  ];

  if (validIps.includes(req.socket.remoteAddress)) {
    next();
  } else {
    // TODO: real log
    console.log('Bad IP: ' + req.socket.remoteAddress);
    // const err = new Error('Not Allowed: ' + req.socket.remoteAddress);
    next();
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(403).send('Forbidden');
});

app.use('/fetch-new', fetchNewRouter);
app.use('/posts', postsRouter);
app.use('/login', loginRouter);

app.get('/', (req, res) => {
  res.send('API');
});

app.listen(port, () => {
  console.log(`API running on port ${port}`);
});
