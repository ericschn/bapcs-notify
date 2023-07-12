import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();

const connectionString = process.env.MONGODB_CONNECTION || '';
const client = new MongoClient(connectionString);

let mongoConnection;

try {
  mongoConnection = await client.connect();
  console.log('connected to mongodb');
} catch (e) {
  console.error(e);
}

let db = mongoConnection.db('bapcs-notify');

export default db;
