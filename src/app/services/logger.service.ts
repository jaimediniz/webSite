import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { localStoreLocation, LogPublisher } from '../shared/log-publisher';
import { LogPublishersService } from '../shared/log-publishers.service';

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
  publishers: LogPublisher[];

  private level = environment.production ? 6 : 0;
  private logWithDate = true;

  constructor(private publishersService: LogPublishersService) {
    // Set publishers
    this.publishers = this.publishersService.publishers;
    this.addLoggerToWindow();
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
    params: any[]
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
    for (const logger of this.publishers) {
      logger.log(entry, color).subscribe((response) => {});
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

  buildLogString(): string {
    let ret = this.color ? '%c' : '';
    ret += this.logWithDate ? `[${this.entryDate}]\n` : '';
    ret += '- Message: ' + this.message;
    if (this.extraInfo.length) {
      ret += '\n- Extra Info:' + formatParams(this.extraInfo);
    }

    return ret;
  }
}
