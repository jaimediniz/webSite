import { Event } from './database';

export interface APIResponse<T = any> {
  code: number;
  error: boolean;
  message: string;
  data: T;
}

export type APILoginResponse = APIResponse<{
  role: string;
  key: string;
}>;

export type APIEventsResponse = APIResponse<Array<Event>>;
