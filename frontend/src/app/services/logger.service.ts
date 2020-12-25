import { Injectable } from '@angular/core';
import { LogPublisher } from '../shared/log-publisher';
import { LogPublishersService } from './log-publishers.service';

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

  private level = 0;
  private logWithDate = false;

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

  setLogWithDate() {
    this.logWithDate = true;
  }

  debug(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.displayDebug, optionalParams);
  }

  info(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.displayInfo, optionalParams);
  }

  warn(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.displayWarn, optionalParams);
  }

  error(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.displayError, optionalParams);
  }

  fatal(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.displayFatal, optionalParams);
  }

  log(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.displayAll, optionalParams);
  }

  private writeToLog(msg: string, level: LogLevel, params: any[]) {
    if (this.shouldLog(level)) {
      const entry: LogEntry = new LogEntry();
      entry.message = msg;
      entry.level = this.level;
      entry.extraInfo = params;
      entry.logWithDate = this.logWithDate;
      for (const logger of this.publishers) {
        logger.log(entry).subscribe((response) => {});
      }
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

export class LogEntry {
  // Public Properties
  entryDate: Date = new Date();
  message = '';
  level: LogLevel = LogLevel.displayDebug;
  extraInfo: any[] = [];
  logWithDate = true;

  buildLogString(): string {
    let ret = '';

    if (this.logWithDate) {
      ret = new Date() + ' - ';
    }

    ret += 'Type: ' + LogLevel[this.level];
    ret += ' - Message: ' + this.message;
    if (this.extraInfo.length) {
      ret += ' - Extra Info: ' + this.formatParams(this.extraInfo);
    }

    return ret;
  }

  private formatParams(params: any[]): string {
    let ret: string = params.join(',');

    // Is there at least one object in the array?
    if (params.some((p) => typeof p == 'object')) {
      ret = '';

      // Build comma-delimited string
      for (const item of params) {
        ret += JSON.stringify(item) + ',';
      }
    }

    return ret;
  }
}
