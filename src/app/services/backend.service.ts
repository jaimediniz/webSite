import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';
import { LoggerService } from './logger.service';
import { APIResponse, QuerySubscription } from '../shared/interfaces';

@Injectable({ providedIn: 'root' })
export class API {
  public activeSession: Subject<string> = new Subject();
  public isAdmin = false;

  private InternalError: APIResponse = {
    statusCode: 500,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      code: 500,
      data: {},
      error: true,
      message: 'Something is wrong!'
    })
  };

  constructor(private logger: LoggerService, private http: HttpClient) {}

  async addSubscription(sub: PushSubscription): Promise<boolean> {
    const jsonSub = sub.toJSON();
    const payLoad: QuerySubscription = {
      url: environment.baseUrl,
      body: {
        route: 'subscriptions',
        endPoint: 'addSubscription',
        publicKey: environment.publicKey,
        name: '',
        endpointURL: jsonSub?.endpoint ?? '',
        keyP256dh: jsonSub.keys?.p256dh ?? '',
        keyAuth: jsonSub.keys?.auth ?? '',
        paused: 'false',
        topics: '*'
      }
    };

    const apiResponse = await this.post('/api/subscribe', payLoad);
    if (apiResponse.statusCode !== 200) {
      return false;
    }
    return true;
  }

  async post(route: string, payLoad: any): Promise<APIResponse> {
    this.logger.log('Payload', payLoad);
    try {
      const response = await this.http
        .post<Promise<APIResponse>>(route, JSON.stringify(payLoad))
        .toPromise();
      this.logger.log('Response:', response);
      return response;
    } catch (error) {
      this.logger.error(error.message);
      return this.InternalError;
    }
  }
}
