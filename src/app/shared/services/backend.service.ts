import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Subject } from 'rxjs';
import { LoggerService } from './logger.service';
import {
  APIEventsResponse,
  APILoginResponse,
  APIResponse
} from '@interfaces/backend';
import {
  Event,
  User,
  Subscription,
  Registration,
  Collections
} from '@interfaces/database';
import { LoadingService } from './loading.service';
import { SweetAlertService } from './sweetAlert.service';
import { CookieService } from 'ngx-cookie';

@Injectable({ providedIn: 'root' })
export class APIService {
  public activeSession: Subject<string> = new Subject();
  public isAdmin = false;

  constructor(
    private logger: LoggerService,
    private http: HttpClient,
    private loading: LoadingService,
    private alert: SweetAlertService,
    private cookieService: CookieService
  ) {}

  async login(payload: {
    username: string;
    password: string;
  }): Promise<boolean> {
    this.loading.startLoading();
    const apiResponse: APILoginResponse = await this.post(
      '/api/login',
      payload
    );
    this.loading.stopLoading();

    const expires = new Date();
    expires.setHours(23, 59, 59, 0);
    this.cookieService.put('Role', apiResponse?.data?.role, {
      expires
    });
    this.cookieService.put('Key', apiResponse?.data?.key, {
      expires
    });

    if (apiResponse?.error) {
      this.alert.toast('Something went wrong!', 'error', apiResponse?.message);
      return false;
    }
    this.alert.toast('Logged!', 'success', 'You are now logged.');
    return true;
  }

  async register(payload: {
    username: string;
    password: string;
    code: string;
  }): Promise<any> {
    this.loading.startLoading();
    const apiResponse = await this.post('/api/register', payload);
    this.loading.stopLoading();
    if (!apiResponse.error) {
      this.alert.toast('Registered!', 'success', '');
      return apiResponse.data || true;
    }
    return;
  }

  // Local Storage
  async cacheInsert(data: any, type: string) {
    const localData = JSON.parse(localStorage?.getItem(type) || 'null');
    localData.push(data);
    localStorage.setItem(type, JSON.stringify(localData));
    return localData;
  }

  async cacheUpdate(element: any, type: string) {
    const localData = JSON.parse(localStorage?.getItem(type) || 'null');
    // eslint-disable-next-line no-underscore-dangle
    const index = localData.findIndex((x: any) => x._id === element._id);
    localData.splice(index, 1);
    localData.push(element);
    localStorage.setItem(type, JSON.stringify(localData));
    return localData;
  }

  async cacheRemove(element: any, type: string) {
    const localData = JSON.parse(localStorage?.getItem(type) || 'null');
    // eslint-disable-next-line no-underscore-dangle
    const index = localData.findIndex((x: any) => x._id === element._id);
    localData.splice(index, 1);
    localStorage.setItem(type, JSON.stringify(localData));
    return localData;
  }

  // Get Information from DB
  async getData(
    type: string,
    endpoint: string,
    shouldAlert: boolean,
    ...query: string[]
  ) {
    const now = new Date();
    const previous = new Date(localStorage?.getItem(type + '_time') || '');
    // milliseconds * seconds * minutes * hours
    if (now.getTime() - previous.getTime() < 1000 * 60 * 60 * 1) {
      return JSON.parse(localStorage?.getItem(type) || 'null');
    }

    const queryParams = query.length > 0 ? '?' + query.join('&') : '';
    const apiResponse: APIEventsResponse = await this.get(
      '/api/' + endpoint + queryParams
    );

    const data = apiResponse?.data;

    if (data) {
      localStorage.setItem(type, JSON.stringify(data));
      localStorage.setItem(type + '_time', `${new Date()}`);
      if (shouldAlert) {
        this.alert.toast('Updated!', 'success', 'The list was updated!');
      }

      return data;
    }
  }

  async getEvents(): Promise<Event[]> {
    const data = await this.getData('Events', 'events', true);
    return data;
  }

  async getUsers(): Promise<User[]> {
    const data = await this.getData('Users', 'admin', true, 'collection=Users');
    return data;
  }

  async getUI(key: string = ''): Promise<Registration[]> {
    const data = await this.getData(`UI_${key}`, 'ui', false, `key=${key}`);
    return data;
  }

  async getUIList(): Promise<Collections[]> {
    const data = await this.getData('UI', 'ui', false, 'key=UI');
    return data;
  }

  async cacheUIElements(): Promise<void> {
    const uiList = await this.getUIList();
    uiList.forEach((el) => this.getUI(el.name));
  }

  // Modify DB
  async addSubscription(sub: PushSubscription): Promise<boolean> {
    const jsonSub = sub.toJSON();
    const payload: Subscription = {
      name: '',
      expirationTime: 'null',
      endpoint: jsonSub?.endpoint ?? '',
      p256dh: jsonSub?.keys?.p256dh ?? '',
      auth: jsonSub?.keys?.auth ?? '',
      paused: false,
      topics: '*'
    };

    const apiResponse = await this.post('/api/subscribe', payload);
    return !(apiResponse as any).error;
  }

  async insertElement(element: any, collection: string): Promise<any> {
    this.loading.startLoading();
    const apiResponse = await this.post(
      `/api/admin?collection=${collection}`,
      element
    );
    this.loading.stopLoading();
    if (!apiResponse.error) {
      this.alert.toast('Added!', 'success', '');
      return apiResponse.data || true;
    }
    return;
  }

  async deleteElement(element: any, collection: string): Promise<any> {
    this.loading.startLoading();
    const apiResponse = await this.del(
      // eslint-disable-next-line no-underscore-dangle
      `/api/admin?collection=${collection}&id=${element._id}`
    );
    this.loading.stopLoading();
    if (!apiResponse.error) {
      this.alert.toast('Deleted!', 'success', '');
      return apiResponse.data || true;
    }
    return;
  }

  async modifyElement(element: any, collection: string): Promise<any> {
    this.loading.startLoading();
    // eslint-disable-next-line no-underscore-dangle
    const { _id: id, ...rest } = element;
    const apiResponse = await this.put(
      `/api/admin?collection=${collection}&id=${id}`,
      rest
    );
    this.loading.stopLoading();
    if (!apiResponse.error) {
      this.alert.toast('Updated!', 'success', '');
      return apiResponse.data || true;
    }
    return;
  }

  // Low level functions
  async requestEnvironment(
    callback: any,
    route: string,
    payload: any,
    method: string
  ): Promise<any> {
    this.logger.log('Route', route);
    this.logger.log('Payload', payload);
    try {
      const requestOptions = {
        headers: new HttpHeaders({
          authorization: this.cookieService.get('Key') ?? ''
        }),
        withCredentials: true
      };
      const response = await callback(route, requestOptions, payload);
      this.logger.log('Response', response);
      return response;
    } catch (error) {
      const response: APIResponse = error.error;
      this.logger.error(`BACKEND - ${method} - ERROR`, error.error);
      return response;
    }
  }

  async get(routeURL: string): Promise<APIResponse> {
    const callback = (route: string, requestOptions: any, payload: any) =>
      this.http.get<Promise<APIResponse>>(route, requestOptions).toPromise();
    return await this.requestEnvironment(callback, routeURL, {}, 'GET');
  }

  async post(routeURL: string, payloadData: any): Promise<APIResponse> {
    const callback = (route: string, requestOptions: any, payload: any) =>
      this.http
        .post<Promise<APIResponse>>(
          route,
          JSON.stringify(payload),
          requestOptions
        )
        .toPromise();
    return await this.requestEnvironment(
      callback,
      routeURL,
      payloadData,
      'POST'
    );
  }

  async put(routeURL: string, payloadData: any): Promise<APIResponse> {
    const callback = (route: string, requestOptions: any, payload: any) =>
      this.http
        .put<Promise<APIResponse>>(
          route,
          JSON.stringify(payload),
          requestOptions
        )
        .toPromise();
    return await this.requestEnvironment(
      callback,
      routeURL,
      payloadData,
      'PUT'
    );
  }

  async del(routeURL: string): Promise<APIResponse> {
    const callback = (route: string, requestOptions: any, payload: any) =>
      this.http.delete<Promise<APIResponse>>(route, requestOptions).toPromise();
    return await this.requestEnvironment(callback, routeURL, {}, 'DELETE');
  }
}
