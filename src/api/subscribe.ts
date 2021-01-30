import { Request, Response } from 'express';
import Status from 'http-status-codes';

import { getBody, insertOne } from './dbConnection';

export default async (request: Request, response: Response) => {
  let body;
  try {
    body = await getBody(request.method, request.body);
  } catch (err) {
    return response
      .status(Status.BAD_REQUEST)
      .send({ error: true, message: err.message });
  }

  const result = await insertOne('Subscriptions', body);
  return response
    .status(result.code)
    .json({ error: result.error, message: result.message });
};
