import { Request, Response } from 'express';
import Status from 'http-status-codes';
import * as bcrypt from 'bcrypt';

import { insertOne } from './dbConnection';

export default async (request: Request, response: Response) => {
  let body;
  try {
    body = JSON.parse(request.body);
  } catch (error) {
    return response
      .status(Status.BAD_REQUEST)
      .json({ error: true, message: 'Body is corrupted!' });
  }

  const payload = {
    username: body.username,
    password: await bcrypt.hash(body.password, 10)
  };

  const result = await insertOne('Users', payload);
  return response
    .status(result.code)
    .json({ error: result.error, message: result.message });
};
