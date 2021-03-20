import { ObjectID } from 'mongodb';
import { Request, Response } from 'express';
import { APIResponse, APIUsersResponse } from '@interfaces/backend';

import {
  getBody,
  getAll,
  insertOne,
  isUserAllowed,
  deleteOne,
  updateOne,
  badRequest
} from './dbConnection';

export default async (request: Request, response: Response) => {
  const isAllowed = await isUserAllowed(request, 'admin');
  if (!isAllowed) {
    return badRequest(response);
  }

  if (request.method === 'GET') {
    return await get(request, response);
  }

  if (request.method === 'POST') {
    return await post(request, response);
  }

  if (request.method === 'PUT') {
    return await put(request, response);
  }

  if (request.method === 'DELETE') {
    return await del(request, response);
  }

  return badRequest(response);
};

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
  if (!collection) {
    return badRequest(response);
  }

  const json: APIResponse = await insertOne(collection, body);
  response.status(json.code).json(json);
  return;
};

const put = async (request: Request, response: Response): Promise<void> => {
  const body = await getBody(request.body);
  if (!body) {
    return badRequest(response);
  }

  const collection = request.query.collection as string;
  const id = request.query.id as string;
  if (!collection || !id) {
    return badRequest(response);
  }

  const json: APIResponse = await updateOne(
    collection,
    {
      // eslint-disable-next-line no-underscore-dangle
      _id: new ObjectID(id)
    },
    body
  );
  response.status(json.code).json(json);
  return;
};

const del = async (request: Request, response: Response): Promise<void> => {
  const collection = request.query.collection as string;
  const id = request.query.id as string;
  if (!collection || !id) {
    return badRequest(response);
  }

  const json: APIResponse = await deleteOne(collection, {
    // eslint-disable-next-line no-underscore-dangle
    _id: new ObjectID(id)
  });
  response.status(json.code).json(json);
  return;
};
