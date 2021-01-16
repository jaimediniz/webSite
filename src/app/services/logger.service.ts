import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

export function logIO(
  target: any,
  propertyKey: string,
  descriptor: TypedPropertyDescriptor<any>
) {
  new LoggerService().log(propertyKey);
  const originalMethod = descriptor.value; // save a reference to the original method

  const logger = new LoggerService();
  descriptor.value = function nameless(...args: any[]) {
    // pre
    const uniqueId = Math.random().toString(36).substring(2);
    logger.debugFunction(propertyKey, true, uniqueId, args);
    // run and store result
    const result = originalMethod.apply(this, args);
    // post
    logger.debugFunction(propertyKey, false, uniqueId, result);
    // return the result of the original method (or modify it before returning)
    return result;
  };
  return descriptor;
}

// eslint-disable-next-line no-shadow
export enum LogLevel {
  displayAll = 0,
  displayDebug = 1,
  displayInfo = 2,
  displayWarn = 3,
  displayError = 4,
  displayFatal = 5,
  displayOff = 6
}

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  public level = environment.production ? 6 : 0;

  publishers: LogPublisher[] = [];
  public logWithDate = true;

  constructor() {
    // Set publishers
    this.buildPublishers();
    this.addLoggerToWindow();
  }

  buildPublishers(): void {
    // Create instance of LogConsole Class
    this.publishers.push(new LogConsole());

    if (environment.production) {
      return;
    }

    // Create instance of `LogLocalStorage` Class
    this.publishers.push(new LogLocalStorage());
  }

  addLoggerToWindow() {
    (window as any).logger = this;
  }

  help(): typeof LogLevel {
    return LogLevel;
  }

  setLevel(level: number): string {
    this.level = level;
    return `Logger Level: ${LogLevel[this.level]}`;
  }

  setLogWithDate(status: boolean): string {
    this.logWithDate = status;
    return `Log with date: ${status}`;
  }

  debugFunction(msg: string, ...optionalParams: any[]) {
    this.writeToLog(
      msg,
      'color:OliveDrab;font-weight:bold;',
      LogLevel.displayDebug,
      optionalParams,
      true
    );
  }

  debug(msg: string, ...optionalParams: any[]) {
    this.writeToLog(
      msg,
      'color:OliveDrab;',
      LogLevel.displayDebug,
      optionalParams
    );
  }

  info(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, 'color:Blue;', LogLevel.displayInfo, optionalParams);
  }

  warn(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, 'color:Orange;', LogLevel.displayWarn, optionalParams);
  }

  error(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, 'color:Red;', LogLevel.displayError, optionalParams);
  }

  fatal(msg: string, ...optionalParams: any[]) {
    this.writeToLog(
      msg,
      'color:Tomato;font-weight:bold;',
      LogLevel.displayFatal,
      optionalParams
    );
  }

  log(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, '', LogLevel.displayAll, optionalParams);
  }

  showStoredLogs(): void {
    const values: Array<LogEntry> =
      JSON.parse(localStorage?.getItem(localStoreLocation) || 'null') || [];

    if (values.length) {
      console.log(
        '%c############### LOCAL STORAGE ###############',
        'color:Tomato;font-weight:bold;'
      );
    }

    values.forEach((element: LogEntry) => {
      if (!this.shouldLog(element.level)) {
        return;
      }
      let ret = element.color ? '%c' : '';
      ret += element.logWithDate ? `[${element.entryDate}]\n` : '';
      ret += '- Message: ' + element.message;
      if (element.extraInfo.length) {
        ret += '\n- Extra Info:' + formatParams(element.extraInfo);
      }
      console.log(ret, element.color);
    });

    if (values.length) {
      console.log(
        '%c#############################################',
        'color:Tomato;font-weight:bold;'
      );
    }
  }

  private writeToLog(
    msg: string,
    color: string,
    level: LogLevel,
    params: any[],
    isFunction: boolean = false
  ): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const entry: LogEntry = new LogEntry();
    entry.message = msg;
    entry.level = this.level;
    entry.extraInfo = params;
    entry.logWithDate = this.logWithDate;
    entry.color = color;
    entry.isFunction = isFunction;
    for (const logger of this.publishers) {
      logger.log(entry, color);
    }
  }

  private shouldLog(level: LogLevel): boolean {
    let ret = false;
    if (
      (level >= this.level && level !== LogLevel.displayOff) ||
      this.level === LogLevel.displayAll
    ) {
      ret = true;
    }
    return ret;
  }
}

const formatParams = (params: any[]): string => {
  let ret: string = params.join(',');

  // Is there at least one object in the array?
  if (params.some((p) => typeof p == 'object')) {
    ret = '';

    // Build comma-delimited string
    for (const item of params) {
      ret += '\n    - ' + JSON.stringify(item);
    }
  }
  return ret;
};

export class LogEntry {
  // Public Properties
  entryDate: string = new Date().toUTCString();
  message = '';
  level: LogLevel = LogLevel.displayDebug;
  extraInfo: any[] = [];
  logWithDate = true;
  color = '';
  isFunction = false;

  buildLogString(): string {
    let ret = this.color ? '%c' : '';
    ret += this.logWithDate ? `[${this.entryDate}]\n` : '';
    if (this.isFunction) {
      return this.function(ret);
    }
    return this.msg(ret);
  }

  function(ret: string) {
    ret += '- Function: ' + this.message;
    ret += '\n- Call ID:  ' + this.extraInfo[1];
    ret += `\n    ${
      this.extraInfo[0] ? 'The method args are' : 'The return value is'
    }: ${JSON.stringify(this.extraInfo[2])}`;
    return ret;
  }

  msg(ret: string) {
    ret += '- Message: ' + this.message;
    if (this.extraInfo.length) {
      ret += '\n- Extra Info:' + formatParams(this.extraInfo);
    }

    return ret;
  }
}

const localStoreLocation = 'logging';

abstract class LogPublisher {
  location: string;
  abstract log(record: LogEntry, color: string): void;
  abstract clear(): void;
}

class LogConsole extends LogPublisher {
  log(entry: LogEntry, color: string): void {
    // Log to console
    console.log(entry.buildLogString(), color);
  }

  clear(): void {
    console.clear();
  }
}

class LogLocalStorage extends LogPublisher {
  constructor() {
    // Must call `super()`from derived classes
    super();

    // Set location
    this.location = localStoreLocation;
  }

  // Append log entry to local storage
  log(entry: LogEntry, color: string): void {
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
  }

  // Clear all log entries from local storage
  clear(): void {
    localStorage.removeItem(this.location);
  }
}
