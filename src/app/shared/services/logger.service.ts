import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';

let gLevel = environment.production ? 6 : 0;

export function logIO() {
  const logger = new LoggerService();
  return (
    target: any,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<any>
  ) => {
    const originalMethod = descriptor.value; // save a reference to the original method
    descriptor.value = async function nameless(...args: any[]) {
      // pre
      const uniqueId = Math.random().toString(36).substring(2);
      logger.debugFunction(propertyKey, true, uniqueId, args);
      // run and store result
      const result = await originalMethod.apply(this, args);
      // post
      logger.debugFunction(propertyKey, false, uniqueId, result);
      // return the result of the original method (or modify it before returning)
      return result;
    };
    return descriptor;
  };
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
    gLevel = level;
    return `Logger Level: ${LogLevel[gLevel]}`;
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
    const values: LogEntry[] =
      JSON.parse(localStorage?.getItem(localStoreLocation) || 'null') || [];

    console.log(
      '%c############### LOCAL STORAGE ###############',
      'color:Tomato;font-weight:bold;'
    );

    values.forEach((element: LogEntry) => {
      if (!this.shouldLog(element.level)) {
        return;
      }
      console.log(LogEntry.msgString(element), element.color);
    });

    console.log(
      '%c#############################################',
      'color:Tomato;font-weight:bold;'
    );
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
    entry.level = gLevel;
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
      (level >= gLevel && level !== LogLevel.displayOff) ||
      gLevel === LogLevel.displayAll
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

  static msgString(entry: LogEntry): string {
    let ret = entry.color ? '%c' : '';
    ret += entry.logWithDate ? `[${entry.entryDate}]\n` : '';
    if (entry.isFunction) {
      return LogEntry.function(entry, ret);
    }
    return LogEntry.msg(entry, ret);
  }

  static function(entry: LogEntry, ret: string) {
    ret += '- Function: ' + entry.message;
    ret += '\n- Call ID:  ' + entry.extraInfo[1];
    ret += `\n    ${
      entry.extraInfo[0] ? 'The method args are' : 'The return value is'
    }: ${JSON.stringify(entry.extraInfo[2])}`;
    return ret;
  }

  static msg(entry: LogEntry, ret: string) {
    ret += '- Message: ' + entry.message;
    if (entry.extraInfo.length) {
      ret += '\n- Extra Info:' + formatParams(entry.extraInfo);
    }
    return ret;
  }

  buildLogString(): string {
    return LogEntry.msgString(this);
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
