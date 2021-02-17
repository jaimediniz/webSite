import { Request, Response } from 'express';
import Status from 'http-status-codes';
import { APIResponse } from 'src/interfaces/backend';

import { getBody, insertOne, getAll } from './dbConnection';

const get = async (): Promise<APIResponse<Array<any>>> =>
  await getAll('Events');

const post = async (request: Request): Promise<APIResponse<any>> => {
  const body = await getBody(request.method, request.body);
  return await insertOne('Events', body);
};

export default async (request: Request, response: Response) => {
  let json: APIResponse<any>;
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
        data: {}
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
      data: {}
    };
    return response.status(Status.INTERNAL_SERVER_ERROR).json(json);
  }
};
