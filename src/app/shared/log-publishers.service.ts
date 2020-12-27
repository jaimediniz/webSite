import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { LogPublisher, LogConsole, LogLocalStorage } from './log-publisher';

@Injectable()
export class LogPublishersService {
  // Public properties

  publishers: LogPublisher[] = [];
  constructor() {
    // Build publishers arrays
    this.buildPublishers();
  }

  // Build publishers array
  buildPublishers(): void {
    // Create instance of LogConsole Class
    this.publishers.push(new LogConsole());

    if (environment.production) {
      return;
    }

    // Create instance of `LogLocalStorage` Class
    this.publishers.push(new LogLocalStorage());
  }
}
