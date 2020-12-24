import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import fetch from 'node-fetch';

interface querySubscription {
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

export async function handler(
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  const query: querySubscription = JSON.parse(event.body as string);

  await fetch(query.url, {
    method: 'post',
    body: JSON.stringify(query.body),
    headers: { 'Content-Type': 'application/json' }
  });

  return {
    statusCode: 201,
    headers: {
      'Content-Type': 'application/json'
    },
    body: '{"Created":true}'
  };
}
