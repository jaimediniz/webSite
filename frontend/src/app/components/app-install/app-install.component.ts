import { Component, OnInit } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { API } from 'src/app/services/backend.service';
import { WindowService } from 'src/app/services/window.service';

@Component({
  selector: 'app-app-install',
  templateUrl: './app-install.component.html',
  styleUrls: ['./app-install.component.scss']
})
export class AppInstallComponent implements OnInit {
  private _window: any;
  public installButton: boolean = false;

  readonly VAPID_PUBLIC_KEY =
    'BI-kZID4MzH86nyjsVHcE9CMwqSPrNtzga1weuQy_9-x68Kee5sxmbhmTUKy-QfhfofXomXZKxkNik5jZPEowOk';

  constructor(
    public winRef: WindowService,
    private swPush: SwPush,
    private api: API
  ) {
    this._window = this.winRef.getWindow();
    if (!this.winRef.isInStandaloneMode) {
      this.installButton = this.winRef.deferredPromptSubject.value
        ? true
        : false;
      this.winRef.deferredPromptSubject.subscribe((e: any) => {
        if (e) {
          this.installButton = true;
        }
      });
    }
  }

  ngOnInit(): void {}

  installApp(event: any) {
    console.log(this.winRef.deferredPromptSubject.value);
    // Show the install prompt
    this.winRef.deferredPromptSubject.value.prompt();
    // Wait for the user to respond to the prompt
    this.winRef.deferredPromptSubject.value.userChoice.then(
      (choiceResult: { outcome: string }) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
      }
    );
  }

  subscribeToNotifications(event: any) {
    this.swPush
      .requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC_KEY
      })
      .then((sub: PushSubscription) => {
        console.log(sub);
        const resp = this.api.addSubscription(sub);
      })
      .catch((err) =>
        console.error('Could not subscribe to notifications', err)
      );
  }
}
