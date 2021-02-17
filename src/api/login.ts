import { Request, Response } from 'express';
import Status from 'http-status-codes';
import * as bcrypt from 'bcrypt';

import { getBody, getAll, getKeyForRole } from './dbConnection';
import { APILoginResponse } from 'src/interfaces/backend';
import { User } from 'src/interfaces/database';

const post = async (
  request: Request
): Promise<{
  code: number;
  error: boolean;
  message: string;
  data: { role: string; key: string };
}> => {
  const body = await getBody(request.method, request.body);
  const users: Array<User> = (
    await getAll('Users', {
      username: body.username
    })
  ).data;

  if (
    users.length < 1 ||
    !(await bcrypt.compare(body.password, users[0].password))
  ) {
    return {
      code: Status.BAD_REQUEST,
      error: true,
      message: 'You have entered an invalid username or password!',
      data: { role: 'user', key: '' }
    };
  }

  const key = await getKeyForRole(users[0].role);

  return {
    code: Status.ACCEPTED,
    error: false,
    message: 'Success',
    data: { role: users[0].role, key }
  };
};

export default async (request: Request, response: Response) => {
  let json: APILoginResponse;
  try {
    let result;
    if (request.method === 'POST') {
      result = await post(request);
    } else {
      result = {
        code: Status.BAD_REQUEST,
        error: true,
        message: 'Bad Request',
        data: { role: '', key: '' }
      };
    }

    json = {
      code: result.code,
      error: result.error,
      message: result.message,
      data: result.data
    };
    return response.status(result.code).json(json);
  } catch (err) {
    json = {
      code: Status.INTERNAL_SERVER_ERROR,
      error: true,
      message: err.message,
      data: { role: '', key: '' }
    };
    return response.status(Status.INTERNAL_SERVER_ERROR).json(json);
  }
};
