import { Request, Response } from 'express';
import { APIEventsResponse } from '@interfaces/backend';

import { getAll, badRequest, getCollections } from './dbConnection';

const get = async (request: Request, response: Response): Promise<void> => {
  const key = request.query.key as string;
  let json: APIEventsResponse;

  if (!key) {
    return badRequest(response);
  }

  if (key === 'UI') {
    json = await getCollections('UI', {}, 'UI');
    response.status(json.code).json(json);
    return;
  }

  json = await getAll(key, {}, 'UI');
  response.status(json.code).json(json);
};

export default async (request: Request, response: Response) => {
  if (request.method === 'GET') {
    return await get(request, response);
  }

  return badRequest(response);
};
