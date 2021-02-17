import { Request, Response } from 'express';
import { APIResponse } from 'src/interfaces/backend';

import { getBody, insertOne, badRequest } from './dbConnection';

const post = async (request: Request, response: Response): Promise<void> => {
  const body = await getBody(request.method, request.body);
  if (!body) {
    return badRequest(response);
  }

  const json: APIResponse = await insertOne('Subscriptions', body);
  response.status(json.code).json(json);
};

export default async (request: Request, response: Response) => {
  if (request.method === 'POST') {
    return await post(request, response);
  }

  return badRequest(response);
};
