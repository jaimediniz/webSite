import { LOCALE_ID, Inject, Injectable } from '@angular/core';
import { CalendarEventTitleFormatter, CalendarEvent } from 'angular-calendar';
import { formatDate } from '@angular/common';

@Injectable()
export class CustomEventFormatter extends CalendarEventTitleFormatter {
  constructor(@Inject(LOCALE_ID) private locale: string) {
    super();
  }

  monthTooltip(event: CalendarEvent): string {
    console.log(event);
    return `A <b>${Math.ceil(
      (new Date(event.meta.event.end).getTime() -
        new Date(event.meta.event.start).getTime()) /
        (1000 * 60 * 60 * 24)
    )}</b> days event`;
  }

  month(event: CalendarEvent): string {
    return `<b>${formatDate(event.start, 'hh:mm', this.locale)}</b> ${
      event.title
    }`;
  }

  // week(event: CalendarEvent): string {
  //   return `<b>${formatDate(event.start, 'hh:mm', this.locale)}</b> ${
  //     event.title
  //   }`;
  // }

  // weekTooltip(event: CalendarEvent): string {
  //   return;
  // }

  // day(event: CalendarEvent): string {
  //   return `<b>${formatDate(event.start, 'hh:mm', this.locale)}</b> ${
  //     event.title
  //   }`;
  // }

  // dayTooltip(event: CalendarEvent): string {
  //   return;
  // }
}
