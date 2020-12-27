import { sendNotification, setVapidDetails, setGCMAPIKey } from 'web-push';
import request from 'request';
import fs from 'fs';
import path from 'path';

const email = 'jaimedinizn@gmail.com';
const GCMAPIKey =
  'BFnDCleBcPbCHW0Wj6m0OngT9665HC6YS2ZI0T-vQIYZmFP1u7XgJQs2GyqclZD_-s_AXS-0KiACzvU_AoqqK4Q';

const backendPublicKey = '7qf4atg8JaQDT0zY1lnI2PUKX9IPwQRj';
const backendUrl =
  'https://script.google.com/macros/s/AKfycbyu6NAklRDLfkJB8yg_HWRiD09hfGw56llpssigb7-bjEhkV-P1/exec';

const vapidKeys = {
  publicKey:
    'BI-kZID4MzH86nyjsVHcE9CMwqSPrNtzga1weuQy_9-x68Kee5sxmbhmTUKy-QfhfofXomXZKxkNik5jZPEowOk',
  privateKey: 'QRebLr-ql9ZKGHUzYHaEtZjVtI2LhXHAn6ZiXseOgcg'
};

setGCMAPIKey(GCMAPIKey);
setVapidDetails(`mailto:${email}`, vapidKeys.publicKey, vapidKeys.privateKey);

sendAllNotification();

function sendAllNotification(): void {
  const payLoad = {
    route: 'subscriptions',
    endPoint: 'getSubscriptions',
    password: process.env.npm_config_password || 'tandemNICE',
    publicKey: backendPublicKey
  };

  request.post(
    {
      headers: { 'content-type': 'application/json' },
      url: backendUrl,
      followAllRedirects: false,
      body: JSON.stringify(payLoad)
    },
    function (error, response, body) {
      if (error) {
        console.error('BACKEND ERROR (1):', error);
      } else {
        log(response.statusCode);
        request(
          response.headers['location'] as string,
          function (err, resp, html) {
            log(resp.statusCode);
            const responseJSON: {
              code: number;
              error: boolean;
              message: string;
              data: { subscriptions: Array<Array<string>> };
            } = JSON.parse(html);

            if (!responseJSON.error) {
              log(responseJSON.message);
              responseJSON.data.subscriptions.forEach((user: any) => {
                let name = user[0];

                sendPushNotification(
                  {
                    endpoint: user[1],
                    expirationTime: user[2],
                    keys: {
                      p256dh: user[3],
                      auth: user[4]
                    },
                    paused: user[5],
                    topics: user[6]
                  },
                  newPayload(name, 'Title 1', 'Body 1')
                );
              });
            } else {
              console.error('BACKEND ERROR (2):', responseJSON.message);
            }
          }
        );
      }
    }
  );
}

function log(content: any) {
  if (process.env.NODE_ENV === 'production') {
    return;
  }
  console.dir(content);
}

var globalPayload: string;
function newPayload(name: string, title?: string, body?: string): string {
  if (globalPayload) {
    return globalPayload;
  }

  let actions: Array<any> = [];
  if (process.env.npm_config_url) {
    if ((process.env.npm_config_url as string).includes('skype')) {
      actions = [
        {
          action: 'skype',
          title: 'Skype session',
          icon: '/assets/skype-icon.png'
        }
      ];
    } else {
      actions = [
        {
          action: 'website',
          title: 'Go to link'
        }
      ];
    }
  }

  const payload = {
    notification: {
      title: process.env.npm_config_title || title,
      body: process.env.npm_config_body || body,
      icon: '/assets/icons/icon-192x192.png',
      badge: '/assets/icons/icon-128x128.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1,
        url: process.env.npm_config_url
      },
      actions: actions
    }
  };
  log(payload);
  globalPayload = JSON.stringify(payload);
  return globalPayload;
}

function sendPushNotification(
  pushSubscription: any,
  notificationPayload: string
): void {
  if (pushSubscription.paused) {
    return;
  }
  log(pushSubscription);
  sendNotification(pushSubscription, notificationPayload)
    .then((response) => log(response))
    .catch((err: Error) => log(err.message));
}
