import { Db, MongoClient } from 'mongodb';

const url = require('url');

let cachedDb: Db;
export async function connectToDatabase(uri: string) {
  if (cachedDb) {
    return cachedDb;
  }

  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  const db = await client.db(url.parse(uri).pathname.substr(1));

  cachedDb = db;
  return db;
}
