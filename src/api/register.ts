import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';

import { insertOne, getBody, badRequest } from './dbConnection';

const roles = {
  6955037335: 'admin',
  3901821888: 'user',
  5365032369: 'mod'
};
const post = async (request: Request, response: Response): Promise<void> => {
  const body = await getBody(request.method, request.body);
  if (!body) {
    return badRequest(response);
  }

  // @ts-expect-error
  const role = roles[body.code];
  if (!role) {
    return badRequest(response);
  }

  const payload = {
    username: body.username,
    password: await bcrypt.hash(body.password, 10),
    role
  };

  const json = await insertOne('Users', payload);
  response.status(json.code).json(json);
};

export default async (request: Request, response: Response) => {
  if (request.method === 'POST') {
    return await post(request, response);
  }

  return badRequest(response);
};
