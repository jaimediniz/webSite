import { Request, Response } from 'express';
import Status from 'http-status-codes';
import { APIResponse } from 'src/interfaces/backend';

import { getBody, insertOne } from './dbConnection';

const post = async (
  request: Request
): Promise<{ code: number; error: boolean; message: string }> => {
  const body = await getBody(request.method, request.body);
  return await insertOne('Subscriptions', body);
};

export default async (request: Request, response: Response) => {
  let json: APIResponse<any>;
  try {
    let result;
    if (request.method === 'POST') {
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
      data: {}
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
