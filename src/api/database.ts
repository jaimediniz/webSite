// Import Dependencies
import { Db, MongoClient } from 'mongodb';
import { Request, Response } from 'express';
const url = require('url');

// Create cached connection variable
let cachedDb: Db;

// A function for connecting to MongoDB,
// taking a single parameter of the connection string
async function connectToDatabase(uri: string) {
  // If the database connection is cached,
  // use it instead of creating a new connection
  if (cachedDb) {
    return cachedDb;
  }

  // If no connection is cached, create a new one
  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  // Select the database through the connection,
  // using the database path of the connection string
  const db = await client.db(url.parse(uri).pathname.substr(1));

  // Cache the database connection and return the connection
  cachedDb = db;
  return db;
}

export default async (request: Request, response: Response) => {
  const db = await connectToDatabase(process.env.MONGODB_URI ?? '');
  const listings = await db
    .collection('listingsAndReviews')
    .find({})
    .sort({ metacritic: -1 })
    .limit(20)
    .toArray();
  return response.status(200).json(listings);
};
