import fetch from 'node-fetch';
import Status from 'http-status-codes';
import { HttpRequest } from '@angular/common/http';

interface QuerySubscription {
  url: string;
  body: {
    route: string;
    endPoint: string;
    publicKey: string;
    name: string;
    endpointURL: string;
    keyP256dh: string;
    keyAuth: string;
    paused: string;
    topics: string;
  };
}

export default async (request: HttpRequest<any>, response: any) => {
  if (request.method !== 'POST') {
    return response.status(Status.BAD_REQUEST).send('');
  }

  const query: QuerySubscription = JSON.parse(request?.body);

  const resp = await fetch(query.url, {
    method: 'post',
    body: JSON.stringify(query?.body ?? 'null'),
    headers: { 'Content-Type': 'application/json' }
  });

  console.log(resp);

  response.send({
    statusCode: 201,
    headers: {
      'Content-Type': 'application/json'
    },
    body: '{"code":201,"error":false,"message":"Success!"}'
  });
};
