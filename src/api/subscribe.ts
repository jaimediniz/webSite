import { Request, Response } from 'express';
import Status from 'http-status-codes';
import { APIResponse } from 'src/app/interfaces/backend';

import { getBody, insertOne } from './dbConnection';

const post = async (
  request: Request
): Promise<{ code: number; error: boolean; message: string }> => {
  const body = await getBody(request.method, request.body);
  return await insertOne('Subscriptions', body);
};

export default async (request: Request, response: Response) => {
  let json: APIResponse;
  try {
    let result;
    if (request.method === 'POST') {
      result = await post(request);
    }

    if (result) {
      json = { error: result.error, message: result.message };
      return response.status(result.code).json(json);
    }

    json = { error: true, message: 'Bad Request' };
    return response.status(Status.BAD_REQUEST).json(json);
  } catch (err) {
    json = { error: true, message: err.message };
    return response.status(Status.INTERNAL_SERVER_ERROR).json(json);
  }
};
