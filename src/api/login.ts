import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';

import { getBody, getAll, login, badRequest } from './dbConnection';
import { User } from '@interfaces/database';

const post = async (request: Request, response: Response): Promise<void> => {
  const body = await getBody(request.body);
  if (!body) {
    return badRequest(response, { role: '', key: '' });
  }

  const user: User = (
    await getAll('Users', {
      username: body.username
    })
  ).data[0];

  if (!user || !(await bcrypt.compare(body.password, user.password))) {
    return badRequest(response, { role: '', key: '' });
  }

  const json = await login(user.role);
  response.status(json.code).json(json);
};

export default async (request: Request, response: Response) => {
  if (request.method === 'POST') {
    return await post(request, response);
  }

  return badRequest(response);
};
