import { ObjectId } from 'bson';
import { Request, Response } from 'express';
import { APIResponse, APIUsersResponse } from 'src/interfaces/backend';

import {
  getBody,
  getAll,
  insertOne,
  isUserAllowed,
  deleteOne,
  badRequest
} from './dbConnection';

const get = async (request: Request, response: Response): Promise<void> => {
  const collection = request.query.collection as string;
  if (!collection) {
    return badRequest(response);
  }
  const json: APIUsersResponse = await getAll(collection);
  response.status(json.code).json(json);
};

const post = async (request: Request, response: Response): Promise<void> => {
  const body = await getBody(request.body);
  if (!body) {
    return badRequest(response);
  }

  const collection = request.query.collection as string;
  const action = request.query.action as string;

  if (!collection || !action) {
    return badRequest(response);
  }

  if (action === 'insert') {
    const json: APIResponse = await insertOne(collection, body);
    response.status(json.code).json(json);
    return;
  }

  if (action === 'delete') {
    const json: APIResponse = await deleteOne(collection, {
      // eslint-disable-next-line no-underscore-dangle
      _id: new ObjectId(body._id)
    });
    response.status(json.code).json(json);
    return;
  }

  return badRequest(response);
};

export default async (request: Request, response: Response) => {
  if (!isUserAllowed(request, 'admin')) {
    return badRequest(response);
  }

  if (request.method === 'GET') {
    return await get(request, response);
  }

  if (request.method === 'POST') {
    return await post(request, response);
  }

  return badRequest(response);
};
