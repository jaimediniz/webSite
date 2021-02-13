import { Request, Response } from 'express';
import Status from 'http-status-codes';

import { connectToDatabase } from './dbConnection';

export default async (request: Request, response: Response) => {
  if (request.method !== 'GET') {
    return response.status(Status.BAD_REQUEST).send('');
  }

  const db = await connectToDatabase();
  /* cSpell:disable */
  const listings = await db
    .collection('Subscriptions')
    .find({})
    .sort({ metacritic: -1 })
    .limit(20)
    .toArray();
  /* cSpell:enable */
  return response.status(Status.ACCEPTED).json(listings);
};
