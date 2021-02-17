import { Db, MongoClient } from 'mongodb';
import Status from 'http-status-codes';
import { APIResponse } from 'src/interfaces/backend';

const url = require('url');

let cachedDb: Db;
export const connectToDatabase = async () => {
  if (cachedDb) {
    return cachedDb;
  }
  const uri = process.env.MONGODB_URI ?? '';

  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  const db = await client.db(url.parse(uri).pathname.substr(1));

  cachedDb = db;
  return db;
};

export const getBody = async (method: string, rawBody: string) => {
  if (method !== 'POST' || !rawBody) {
    throw new Error('Method not allowed.');
  }

  let body;
  try {
    body = JSON.parse(rawBody);
  } catch (error) {
    throw new Error('Body is corrupted!');
  }

  return body;
};

export const insertOne = async (
  collection: string,
  body: any
): Promise<APIResponse> => {
  try {
    const db = await connectToDatabase();
    const result = await db.collection(collection).insertOne(body);
    console.log(result);
    return {
      code: Status.CREATED,
      error: false,
      message: '',
      data: result
    };
  } catch (err) {
    console.log(err);
    return {
      code: Status.INTERNAL_SERVER_ERROR,
      error: true,
      message: err.message,
      data: []
    };
  }
};

export const getAll = async (
  collection: string,
  find: any = {}
): Promise<APIResponse<Array<any>>> => {
  try {
    const db = await connectToDatabase();
    const result = await db.collection(collection).find(find).toArray();
    return {
      code: Status.ACCEPTED,
      error: false,
      message: '',
      data: result
    };
  } catch (err) {
    console.log(err);
    return {
      code: Status.INTERNAL_SERVER_ERROR,
      error: true,
      message: err.message,
      data: []
    };
  }
};
