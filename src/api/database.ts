import { Request, Response } from 'express';
import Status from 'http-status-codes';

import { connectToDatabase } from './dbConnection';

export default async (request: Request, response: Response) => {
  if (request.method !== 'GET') {
    return response.status(Status.BAD_REQUEST).send('');
  }

  const db = await connectToDatabase(
    process.env.MONGODB_URI?.replace('{DB}', 'sample_airbnb') ?? ''
  );
  const listings = await db
    .collection('listingsAndReviews')
    .find({})
    .sort({ metacritic: -1 })
    .limit(20)
    .toArray();
  return response.status(Status.ACCEPTED).json(listings);
};
