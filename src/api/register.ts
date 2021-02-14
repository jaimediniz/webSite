import { Request, Response } from 'express';
import Status from 'http-status-codes';
import * as bcrypt from 'bcrypt';

import { insertOne } from './dbConnection';

const roles = {
  6955037335: 'admin',
  3901821888: 'user',
  5365032369: 'mod'
};

export default async (request: Request, response: Response) => {
  let body;
  try {
    body = JSON.parse(request.body);
  } catch (error) {
    return response
      .status(Status.BAD_REQUEST)
      .json({ error: true, message: 'Body is corrupted!' });
  }

  // @ts-expect-error
  const role = roles[body.code];
  console.log(role);
  if (!role) {
    return response
      .status(Status.BAD_REQUEST)
      .json({ error: true, message: 'Body is corrupted!' });
  }

  const payload = {
    username: body.username,
    password: await bcrypt.hash(body.password, 10),
    role
  };

  const result = await insertOne('Users', payload);
  return response
    .status(result.code)
    .json({ error: result.error, message: result.message });
};
