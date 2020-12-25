import { Component, OnInit } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { API } from 'src/app/services/backend.service';
import { LoadingService } from 'src/app/services/loading.service';
import { LoggerService } from 'src/app/services/logger.service';
import { SweetAlertService } from 'src/app/services/sweetAlert.service';
import { WindowService } from 'src/app/services/window.service';

@Component({
  selector: 'app-external',
  templateUrl: './external.component.html',
  styleUrls: ['./external.component.scss']
})
export class AppInstallComponent implements OnInit {
  public installButton = false;
  public subscribeButton = false;

  readonly vapidPublicKey =
    'BI-kZID4MzH86nyjsVHcE9CMwqSPrNtzga1weuQy_9-x68Kee5sxmbhmTUKy-QfhfofXomXZKxkNik5jZPEowOk';

  private windowEl: any;

  constructor(
    private logger: LoggerService,
    private winRef: WindowService,
    private swPush: SwPush,
    private api: API,
    private alert: SweetAlertService,
    private loading: LoadingService
  ) {
    this.windowEl = this.winRef.getWindow();
    if (Notification.permission === 'default') {
      this.askToSubscribe();
    }

    if (!this.winRef.isInStandaloneMode) {
      this.installButton = this.winRef.deferredPromptSubject.value
        ? false // hide button
        : false;
      this.winRef.deferredPromptSubject.subscribe((e: any) => {
        if (e) {
          this.installButton = true;
        }
      });
    }
  }

  ngOnInit(): void {}

  installApp(event: any): void {
    this.logger.log('', this.winRef.deferredPromptSubject.value);
    // Show the install prompt
    this.winRef.deferredPromptSubject.value.prompt();
    // Wait for the user to respond to the prompt
    this.winRef.deferredPromptSubject.value.userChoice.then(
      (choiceResult: { outcome: string }) => {
        if (choiceResult.outcome === 'accepted') {
          this.logger.log('User accepted the install prompt');
        } else {
          this.logger.log('User dismissed the install prompt');
        }
      }
    );
  }

  async askToSubscribe(): Promise<void> {
    const subscribe = await this.alert.fireQuestion(
      'Subscribe to Notifications',
      'This way you can keep updated!',
      'question',
      'Subscribe',
      'Cancel'
    );

    if (!subscribe) {
      return;
    }

    try {
      const sub: PushSubscription = await this.swPush.requestSubscription({
        serverPublicKey: this.vapidPublicKey
      });
      this.logger.log('Subscription:', sub);
      const resp = await this.api.addSubscription(sub);
      if (resp) {
        this.alert.fire('Subscribed!', '', 'success');
      }
    } catch (err) {
      this.alert.fire('Error!', err.message, 'error');
      this.logger.error(err.message);
    }
  }
}
