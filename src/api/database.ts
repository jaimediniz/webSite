// @ts-ignore
import { connectToDatabase } from '../../util/mongodb';
import { HttpRequest } from '@angular/common/http';

export default async (request: HttpRequest<any>, response: any) => {
  const { db } = await connectToDatabase();
  const movies = await db
    .collection('movies')
    .find({})
    .sort({ metacritic: -1 })
    .limit(20)
    .toArray();
  response.json(movies);
};
