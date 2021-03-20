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

export interface BaseEvent {
  description: string;
  status: 'TENTATIVE' | 'CONFIRMED' | 'CANCELLED';
  start: string | string[];
  end: string | string[];
  url: string;
  location: string;
}

export interface Event extends BaseEvent {
  _id?: ObjectId;
  name: string;
  author: string;
  start: string;
  end: string;
  imageUrl: string;
}

export type ICSEvent = BaseEvent & {
  title: string;
  organizer: {
    name: string;
  };
  calName: string;
  start: string[];
  end: string[];
};

export interface User {
  _id: ObjectId;
  name: string;
  username: string;
  password: string;
  role: string;
}

export interface External {
  _id: ObjectId;
  key: string;
  value: string;
}
