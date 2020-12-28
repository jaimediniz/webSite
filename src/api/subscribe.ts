import fetch from 'node-fetch';
import Status from 'http-status-codes';
import { HttpRequest } from '@angular/common/http';

export default async (request: HttpRequest<any>, response: any) => {
  if (request.method !== 'POST') {
    return response.status(Status.BAD_REQUEST).send('');
  }

  if (!request.body) {
    return response.status(Status.BAD_REQUEST).send('');
  }

  const resp = await fetch('%baseUrl%', {
    method: 'post',
    body: request.body
  });

  console.log(resp);

  response.send({
    statusCode: 201,
    body: '{"code":201,"error":false,"message":"???!"}'
  });
};
