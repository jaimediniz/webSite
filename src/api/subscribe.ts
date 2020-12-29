import { Request, Response } from 'express';
import Status from 'http-status-codes';

import { connectToDatabase } from './dbConnection';

export default async (request: Request, response: Response) => {
  if (request.method !== 'POST' || !request.body) {
    return response
      .status(Status.BAD_REQUEST)
      .send({ error: true, message: 'Method not allowed.' });
  }

  let body;
  try {
    body = JSON.parse(request.body);
    console.log(body);
  } catch (error) {
    return response
      .status(Status.BAD_REQUEST)
      .json({ error: true, message: 'Body is corrupted!' });
  }

  try {
    const db = await connectToDatabase();
    const result = await db.collection('Subscriptions').insertOne(body);
    console.log(result);
    return response
      .status(Status.CREATED)
      .json({ error: false, message: result });
  } catch (err) {
    console.log(err);
    return response
      .status(Status.INTERNAL_SERVER_ERROR)
      .json({ error: true, message: err.message });
  }
};
