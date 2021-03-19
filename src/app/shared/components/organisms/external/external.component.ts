import { Component, OnInit } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { APIService } from 'src/app/shared/services/backend.service';
import { LoggerService } from 'src/app/shared/services/logger.service';
import { SweetAlertService } from 'src/app/shared/services/sweetAlert.service';
import { WindowService } from 'src/app/shared/services/window.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-external',
  templateUrl: './external.component.html',
  styleUrls: ['./external.component.scss']
})
export class AppInstallComponent implements OnInit {
  public installButton = false;
  public subscribeButton = false;

  readonly vapidPublicKey = environment.vapidPublicKey;

  constructor(
    private logger: LoggerService,
    private winRef: WindowService,
    private swPush: SwPush,
    private api: APIService,
    private alert: SweetAlertService
  ) {
    if (Notification.permission === 'default') {
      this.askToSubscribe();
    }

    if (!this.winRef.isInStandaloneMode) {
      // this.installButton = this.winRef.deferredPromptSubject.value
      //   ? false // hide button
      //   : true;
      this.winRef.deferredPromptSubject.subscribe((e: any) => {
        if (e) {
          this.installButton = true;
        }
      });
    }
  }

  ngOnInit(): void {}

  installApp(event: any): void {
    this.logger.debug('', this.winRef.deferredPromptSubject.value);

    this.winRef.deferredPromptSubject.value.prompt();
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
    // const subscribe = await this.alert.fireQuestion(
    //   'Subscribe to Notifications',
    //   'This way you can keep updated!',
    //   'question',
    //   'Subscribe',
    //   'Cancel'
    // );

    // if (!subscribe) {
    //   return;
    // }

    try {
      const sub: PushSubscription = await this.swPush.requestSubscription({
        serverPublicKey: this.vapidPublicKey
      });
      this.logger.debug('Subscription:', sub);
      const resp = await this.api.addSubscription(sub);
      if (resp) {
        this.alert.toast('Subscribed!', 'success', '');
      }
    } catch (err) {
      // this.alert.fire('Error!', err.message, 'error');
      this.logger.error(err.message);
    }
  }
}
