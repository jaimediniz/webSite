import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-nav-links',
  templateUrl: './nav-links.component.html',
  styleUrls: ['./nav-links.component.scss']
})
export class NavLinksComponent implements OnInit {
  @Input() homeButton: boolean;
  @Input() activitiesButton: boolean;
  @Input() loginButton: boolean;
  @Input() registerButton: boolean;
  @Input() scheduleButton: boolean;
  @Input() aboutButton: boolean;

  @Input() adminButton: boolean;
  @Input() chatButton: boolean;
  @Input() feedbackButton: boolean;
  @Input() logoffButton: boolean;

  @Output() emitLogin: EventEmitter<void> = new EventEmitter();
  @Output() emitLogoff: EventEmitter<void> = new EventEmitter();
  @Output() emitTest: EventEmitter<boolean> = new EventEmitter(true);

  // Test button is only showed in dev
  public testButton = !environment.production;

  constructor(public router: Router) {}

  ngOnInit(): void {}

  login() {
    this.emitLogin.emit();
  }
  logoff() {
    this.emitLogoff.emit();
  }
  test() {
    this.emitTest.emit(true);
  }
}
