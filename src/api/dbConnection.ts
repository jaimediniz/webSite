import { Request, Response } from 'express';
import { Db, MongoClient } from 'mongodb';
import Status from 'http-status-codes';
import * as bcrypt from 'bcrypt';
import { APIResponse } from '@interfaces/backend';

const url = require('url');

// Adds complexity to the key
const RANDOM_KEY = 'UAF7EeHWsF7cL73i4A3';
const expires = () => {
  const expiresDate = new Date();
  expiresDate.setHours(23, 59, 59, 0);
  return expiresDate.getTime();
};

export const isUserAllowed = async (
  request: Request,
  role: string
): Promise<boolean> =>
  await bcrypt.compare(
    expires() + role + RANDOM_KEY,
    request?.headers?.authorization ?? ''
  );

export const getKeyForRole = async (role: string) =>
  await bcrypt.hash(expires() + role + RANDOM_KEY, 10);

export const login = async (role: string) => {
  const key = await getKeyForRole(role);
  return {
    code: Status.ACCEPTED,
    error: false,
    message: 'Logged',
    data: { role, key }
  };
};

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

export const getBody = async (rawBody: string) => {
  let body;
  try {
    body = JSON.parse(rawBody);
  } catch (error) {
    throw new Error(
      JSON.stringify({
        error: {
          code: 400,
          error: true,
          message: 'Body is corrupted!',
          data: {}
        }
      })
    );
  }

  return body;
};

export const insertOne = async (
  collection: string,
  body: any
): Promise<APIResponse> =>
  doDbAction(collection, '', 'insertOne', Status.CREATED, body);

export const deleteOne = async (
  collection: string,
  find: any
): Promise<APIResponse> =>
  doDbAction(collection, find, 'deleteOne', Status.ACCEPTED);

export const updateOne = async (
  collection: string,
  find: any,
  body: any
): Promise<APIResponse> =>
  doDbAction(collection, find, 'updateOne', Status.ACCEPTED, body);

export const getAll = async (
  collection: string,
  find: any = {}
): Promise<APIResponse<any[]>> =>
  doDbAction(collection, find, 'getAll', Status.ACCEPTED);

const doDbAction = async (
  collection: string,
  find: any = {},
  type: string,
  successCode: number,
  body?: any
): Promise<APIResponse<any[]>> => {
  let result: any;
  try {
    const db = await connectToDatabase();
    switch (type) {
      case 'insertOne':
        result = await db.collection(collection).insertOne(body);
        break;
      case 'deleteOne':
        result = await db.collection(collection).deleteOne(find);
        break;
      case 'updateOne':
        result = await db
          .collection(collection)
          .updateOne(find, { $set: body });
        break;
      case 'getAll':
        result = await db.collection(collection).find(find).toArray();
        break;
      default:
        throw new Error('Method not allowed!');
    }
    return {
      code: successCode,
      error: false,
      message: '',
      data: result
    };
  } catch (err) {
    return {
      code: Status.INTERNAL_SERVER_ERROR,
      error: true,
      message: err.message,
      data: []
    };
  }
};

export const badRequest = (response: Response, data = {}): void => {
  const error: APIResponse = {
    code: Status.BAD_REQUEST,
    error: true,
    message: 'Bad Request',
    data
  };
  response.status(error.code).json(error);
};
