import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import db from '../db/conn.js';

const usersDb = db.collection('users');

export const protect = async (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await usersDb.findOne({ _id: new ObjectId(decoded.userId) });
      // req.user.password = null;
      delete req.user.password;
      next();
    } catch (err) {
      res.status(401).json({ error: 'token validation failed: ' });
    }
  } else {
    res.status(401).json({ error: 'no token' });
  }
};
