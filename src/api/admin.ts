import { Request, Response } from 'express';
import { APIResponse, APIUsersResponse } from 'src/interfaces/backend';

import {
  getBody,
  getAll,
  insertOne,
  isUserAllowed,
  badRequest
} from './dbConnection';

const get = async (request: Request, response: Response): Promise<void> => {
  const json: APIUsersResponse = await getAll('Users');
  response.status(json.code).json(json);
};

const post = async (request: Request, response: Response): Promise<void> => {
  const body = await getBody(request.body);
  if (!body) {
    return badRequest(response);
  }
  const json: APIResponse = await insertOne('Users', body);
  response.status(json.code).json(json);
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
