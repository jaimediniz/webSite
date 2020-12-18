import { Component, OnInit } from '@angular/core';
import { WindowService } from 'src/app/services/window.service';

@Component({
  selector: 'app-app-install',
  templateUrl: './app-install.component.html',
  styleUrls: ['./app-install.component.scss']
})
export class AppInstallComponent implements OnInit {
  private _window: any;
  public installButton: boolean = false;

  constructor(public winRef: WindowService) {
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
}
