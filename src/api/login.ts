import { Request, Response } from 'express';
import Status from 'http-status-codes';
import * as bcrypt from 'bcrypt';

import { getBody, getAll } from './dbConnection';
import { APILoginResponse } from 'src/interfaces/backend';
import { Users } from 'src/interfaces/database';

export const isValidKey = (key: string) =>
  // TODO: Check if cookie is valid
  true;

const get = async (): Promise<{
  code: number;
  error: boolean;
  message: string;
  data: any;
}> => {
  if (!isValidKey('')) {
    return {
      code: Status.BAD_REQUEST,
      error: true,
      message: 'The cookie is expired!',
      data: { role: 'user', key: '' }
    };
  }
  return { code: Status.ACCEPTED, error: false, message: 'Success', data: {} };
};

const post = async (
  request: Request
): Promise<{
  code: number;
  error: boolean;
  message: string;
  data: { role: string; key: string };
}> => {
  const body = await getBody(request.method, request.body);
  const users: Array<Users> = (
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

  // TODO: create cookie

  return {
    code: Status.ACCEPTED,
    error: false,
    message: 'Success',
    data: { role: users[0].role, key: '123' }
  };
};

export default async (request: Request, response: Response) => {
  let json: APILoginResponse;
  try {
    let result;
    if (request.method === 'GET') {
      result = await get();
    } else if (request.method === 'POST') {
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
