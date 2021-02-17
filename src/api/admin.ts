import { Request, Response } from 'express';
import Status from 'http-status-codes';
import { APIResponse } from 'src/interfaces/backend';

import { getAll, isUserAllowed } from './dbConnection';

const get = async (): Promise<APIResponse<Array<any>>> => await getAll('Users');

export default async (request: Request, response: Response) => {
  let json: APIResponse<Array<any>>;
  if (!isUserAllowed(request, 'admin')) {
    json = {
      code: Status.BAD_REQUEST,
      error: true,
      message: 'Access denied.',
      data: []
    };
    return response.status(json.code).json(json);
  }

  try {
    let result;
    if (request.method === 'GET') {
      result = await get();
    } else {
      result = {
        code: Status.BAD_REQUEST,
        error: true,
        message: 'Bad Request',
        data: []
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
      data: []
    };
    return response.status(Status.INTERNAL_SERVER_ERROR).json(json);
  }
};
