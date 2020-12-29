import { ObjectId } from 'bson';

export interface APIResponse {
  statusCode: number;
  headers: {
    'Content-Type': string;
  };
  body: string;
}

export interface Subscription {
  _id?: ObjectId;
  name: string;
  endpoint: string;
  expirationTime: string;
  p256dh: string;
  auth: string;
  paused: boolean;
  topics: string;
}
