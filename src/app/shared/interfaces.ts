export interface APIResponse {
  statusCode: number;
  headers: {
    'Content-Type': string;
  };
  body: string;
}
