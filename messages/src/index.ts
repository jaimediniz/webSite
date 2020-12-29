import { sendNotification, setVapidDetails, setGCMAPIKey } from 'web-push';
import dotenv from 'dotenv';
//@ts-ignore
import { connectToDatabase } from '../../src/api/dbConnection';
//@ts-ignore
import { Subscription } from '../../src/app/shared/interfaces';
import { Collection, Db, ObjectId } from 'mongodb';

const email = 'jaimedinizn@gmail.com';
const GCMAPIKey =
  'BFnDCleBcPbCHW0Wj6m0OngT9665HC6YS2ZI0T-vQIYZmFP1u7XgJQs2GyqclZD_-s_AXS-0KiACzvU_AoqqK4Q';

const vapidKeys = {
  publicKey:
    'BI-kZID4MzH86nyjsVHcE9CMwqSPrNtzga1weuQy_9-x68Kee5sxmbhmTUKy-QfhfofXomXZKxkNik5jZPEowOk',
  privateKey: 'QRebLr-ql9ZKGHUzYHaEtZjVtI2LhXHAn6ZiXseOgcg'
};

setGCMAPIKey(GCMAPIKey);
setVapidDetails(`mailto:${email}`, vapidKeys.publicKey, vapidKeys.privateKey);

sendAllNotification();

let collection: Collection<Subscription>;
let subscriptions: Array<Subscription>;
let expired: Array<Subscription> = [];
let itemsProcessed = 0;

function done() {
  log('All done');
  process.exit(0);
}

function updateDatabase() {
  if (expired.length === 0) {
    done();
  }

  let itemsProcessed = 0;
  expired.forEach(async (subscription) => {
    await collection.deleteOne({ _id: subscription._id });
    itemsProcessed++;
    if (itemsProcessed === expired.length) {
      done();
    }
  });
}

async function sendAllNotification(): Promise<boolean> {
  const result = dotenv.config({ path: __dirname + '/./../../.env' });
  if (result.error) {
    throw result.error;
  }
  log(result.parsed);

  try {
    collection = (
      await connectToDatabase(
        process.env.MONGODB_URI?.replace('{DB}', 'Tandem') ?? ''
      )
    ).collection('Subscriptions');
    subscriptions = await collection.find({}).toArray();
  } catch (err) {
    console.error(err);
    return false;
  }

  if (subscriptions.length === 0) {
    done();
  }

  subscriptions.forEach((subscription: Subscription) => {
    log(subscription);
    sendPushNotification(subscription);
  });
  return true;
}

function log(content: any) {
  if (process.env.NODE_ENV === 'production') {
    return;
  }
  console.dir(content);
}

var globalPayload: string;
function newPayload(name?: string, title?: string, body?: string): string {
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

function sendPushNotification(subscription: Subscription): void {
  if (subscription.paused) {
    return;
  }

  const pushSubscription = {
    endpoint: subscription.endpoint,
    expirationTime: subscription.expirationTime,
    keys: {
      p256dh: subscription.p256dh,
      auth: subscription.auth
    }
  };

  const notificationPayload = newPayload(
    subscription.name,
    'Title 1',
    'Body 1'
  );

  sendNotification(pushSubscription, notificationPayload)
    .then((response) => log(response))
    .catch((err) => {
      log(err.body);
      if (err.body.includes('expired')) {
        expired.push(subscription);
      }
    })
    .finally(() => {
      itemsProcessed++;
      if (itemsProcessed === subscriptions.length) {
        updateDatabase();
      }
    });
}
