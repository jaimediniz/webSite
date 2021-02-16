export interface APIResponse {
  error: boolean;
  message: string;
  data?: any;
}

export interface APILoginResponse extends APIResponse {
  data: {
    role: string;
    key: string;
  };
}

export interface APIEventsResponse extends APIResponse {
  data: {
    role: string;
    key: string;
  };
}
