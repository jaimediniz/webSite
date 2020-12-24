import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

export async function handler(
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  const query = event.queryStringParameters;

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(query)
  };
}
