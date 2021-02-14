import { Request, Response } from 'express';

import { getBody, insertOne, getAll } from './dbConnection';

export default async (request: Request, response: Response) => {
  let body;
  let result;
  try {
    body = await getBody(request.method, request.body);
    result = await insertOne('Events', body);
  } catch (err) {
    result = await getAll('Events');
  }

  return response
    .status(result.code)
    .json({ error: result.error, message: result.message });
};
