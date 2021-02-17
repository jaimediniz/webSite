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
  status: 'TENTATIVE' | 'CONFIRMED' | 'CANCELLED';
  author: string;
  start: string;
  end: string;
  url: string;
  imageUrl: string;
  location: string;
}

export interface User {
  _id?: ObjectId;
  name: string;
  username: string;
  password: string;
  role: string;
}
