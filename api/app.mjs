import express from 'express';
import cors from 'cors';
import db from './db/conn.mjs';
import { workerRouter, initializeApp } from './routes/worker.mjs';
import { postsRouter } from './routes/posts.mjs';
import { loginRouter } from './routes/login.mjs';

const app = express();
const port = process.env.PORT;
const postsCollection = db.collection('posts');
const router = express.Router();

initializeApp();

// set route prefix
app.use('/api/v1', router);

router.use(cors());

// TODO: api keys, jwt
// app.use((req, res, next) => {
//   let validIps = [
//     '::ffff:127.0.0.1',
//     process.env.IP_LOCAL,
//     process.env.IP_HOME,
//   ];

//   if (validIps.includes(req.socket.remoteAddress)) {
//     next();
//   } else {
//     // TODO: real log
//     console.log('IP not on whitelist: ' + req.socket.remoteAddress);
//     const err = new Error('Not Allowed');
//     next(err);
//   }
// });

// app.use((err, req, res, next) => {
//   // console.error(err.stack);
//   res.status(403).send('Forbidden');
// });

router.use('/worker', workerRouter);
router.use('/posts', postsRouter);
router.use('/login', loginRouter);

router.get('/', (req, res) => {
  res.send('API - /api/v1');
});

app.listen(port, () => {
  console.log(`API running on port ${port}`);
});
