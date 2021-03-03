import { Request, Response } from 'express';
import { APIEventsResponse } from 'src/interfaces/backend';

import { getAll, badRequest } from './dbConnection';

const get = async (request: Request, response: Response): Promise<void> => {
  const key = request.query.key as string;
  if (!key) {
    return badRequest(response);
  }

  const json: APIEventsResponse = await getAll('External', {
    key
  });
  response.status(json.code).json(json);
};

export default async (request: Request, response: Response) => {
  if (request.method === 'GET') {
    return await get(request, response);
  }

  return badRequest(response);
};
