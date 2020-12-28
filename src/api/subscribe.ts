import fetch from 'node-fetch';
import Status from 'http-status-codes';
import { Request, Response } from 'express';

export default async (request: Request<any>, response: Response) => {
  if (request.method !== 'POST') {
    return response.status(Status.BAD_REQUEST).send('');
  }

  if (!request.body) {
    return response.status(Status.BAD_REQUEST).send('');
  }

  const resp = await fetch(process.env.MONGODB_URI ?? '', {
    method: 'post',
    body: request.body
  });

  console.log(resp);

  return response.send({
    statusCode: 201,
    body: '{"code":201,"error":false,"message":"???!"}'
  });
};
