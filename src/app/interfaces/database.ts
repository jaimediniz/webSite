/* cspell: disable-next-line */
import { ObjectId } from 'bson';

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

export interface Event {
  _id?: ObjectId;
  name: string;
  description: string;
  author: string;
  creation: string;
  start: string;
  end: string;
  status: boolean;
}
