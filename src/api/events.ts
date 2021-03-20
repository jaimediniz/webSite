import { Request, Response } from 'express';
import { APIEventsResponse } from '@interfaces/backend';

import { getAll, badRequest } from './dbConnection';

const get = async (response: Response): Promise<void> => {
  const json: APIEventsResponse = await getAll('Events');
  response.status(json.code).json(json);
};

// const post = async (request: Request, response: Response): Promise<void> => {
//   const body = await getBody(request.body);
//   if (!body) {
//     return badRequest(response);
//   }
//   const json: APIResponse = await insertOne('Events', body);
//   response.status(json.code).json(json);
// };

export default async (request: Request, response: Response) => {
  if (request.method === 'GET') {
    return await get(response);
  }

  // if (request.method === 'POST') {
  //   return await post(request, response);
  // }

  return badRequest(response);
};
