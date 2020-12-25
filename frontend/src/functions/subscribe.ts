import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import fetch from 'node-fetch';

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

exports.handler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  const query: QuerySubscription = JSON.parse(event.body as string);

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
    body: '{"code":201,"error":false,"message":"Success!"}'
  };
};
