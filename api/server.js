import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { workerRouter, initializeApp } from './routes/worker.js';
import { postsRouter } from './routes/posts.js';
import { userRouter } from './routes/userRoutes.js';

const app = express();
const port = process.env.PORT;
const router = express.Router();

initializeApp();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use('/api/v1', router);
router.use('/worker', workerRouter);
router.use('/posts', postsRouter);
router.use('/user', userRouter);

// app.get('/', (req, res) => {
//   res.status(404).send();
// });
// app.get('*', (req, res) => res.redirect('/'));

app.listen(port, () => {
  console.log(`API running on port ${port}`);
});
