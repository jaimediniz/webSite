import { Request, Response } from 'express';
import Status from 'http-status-codes';
import { APIResponse } from 'src/interfaces/backend';

import { getAll, isValidKeyForRole } from './dbConnection';

const get = async (request: Request): Promise<APIResponse<Array<any>>> => {
  if (
    !(await isValidKeyForRole(request?.headers?.authorization ?? '', 'admin'))
  ) {
    return {
      code: Status.BAD_REQUEST,
      error: true,
      message: 'Access denied.',
      data: []
    };
  }
  return await getAll('Users');
};

export default async (request: Request, response: Response) => {
  let json: APIResponse;
  try {
    let result;
    if (request.method === 'GET') {
      result = await get(request);
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
