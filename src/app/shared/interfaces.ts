export interface APIResponse {
  statusCode: number;
  headers: {
    'Content-Type': string;
  };
  body: string;
}

export interface QuerySubscription {
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
