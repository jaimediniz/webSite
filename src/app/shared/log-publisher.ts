import { LogEntry } from '../services/logger.service';
import { Observable, of } from 'rxjs';

export const localStoreLocation = 'logging';

export abstract class LogPublisher {
  location: string;
  abstract log(record: LogEntry, color: string): Observable<boolean>;
  abstract clear(): Observable<boolean>;
}

export class LogConsole extends LogPublisher {
  log(entry: LogEntry, color: string): Observable<boolean> {
    // Log to console
    console.log(entry.buildLogString(), color);
    return of(true);
  }

  clear(): Observable<boolean> {
    console.clear();
    return of(true);
  }
}

export class LogLocalStorage extends LogPublisher {
  constructor() {
    // Must call `super()`from derived classes
    super();

    // Set location
    this.location = localStoreLocation;
  }

  // Append log entry to local storage
  log(entry: LogEntry, color: string): Observable<boolean> {
    let ret = false;
    let values: LogEntry[];

    try {
      // Get previous values from local storage
      values = JSON.parse(localStorage?.getItem(this.location) || 'null') || [];

      // Add new log entry to array
      values.push(entry);

      // Store array into local storage
      localStorage.setItem(this.location, JSON.stringify(values));

      // Set return value
      ret = true;
    } catch (ex) {
      // Display error in console
      console.warn(ex);
    }

    return of(ret);
  }

  // Clear all log entries from local storage
  clear(): Observable<boolean> {
    localStorage.removeItem(this.location);
    return of(true);
  }
}