import { Component, OnDestroy, OnInit } from '@angular/core';
import { CalendarEventTitleFormatter, CalendarView } from 'angular-calendar';
import { CalendarEvent } from 'calendar-utils';
import { isSameMonth, isSameDay } from 'date-fns';

import { APIService } from '@services/backend.service';
import { SweetAlertService } from '@services/sweetAlert.service';

import { Event, ICSEvent } from '@interfaces/database';
import { CustomEventFormatter } from './custom-event-formatter.provider';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
  providers: [
    {
      provide: CalendarEventTitleFormatter,
      useClass: CustomEventFormatter
    }
  ]
})
export class ScheduleComponent implements OnInit, OnDestroy {
  viewDate: Date = new Date();
  events: CalendarEvent<any>[];
  view: CalendarView = CalendarView.Month;
  calendarView = CalendarView;
  activeDayIsOpen = false;

  public hideExportButton = true;

  location = 'schedule';

  constructor(private api: APIService, private alert: SweetAlertService) {
    this.fetchEvents();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  async fetchEvents() {
    const response = await this.api.getEvents();
    this.events = (response as any).map((event: Event) => {
      // Preload images
      const tmpImg = new Image();
      tmpImg.src = event.imageUrl;
      return {
        title: event.name,
        start: new Date(event.start),
        color: '#fff',
        allDay: true,
        meta: {
          event
        }
      };
    });
    this.hideExportButton = false;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  dayClicked({
    date,
    events
  }: {
    date: Date;
    events: CalendarEvent<{ event: Event }>[];
  }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }

  eventClicked(event: CalendarEvent<{ event: Event }>): void {
    if (!event?.meta?.event) {
      return;
    }
    this.alert.displayEvent(event.meta.event);
  }

  async exportSchedule() {
    const exportEvents: ICSEvent[] = [];

    for (const fullEvent of this.events) {
      const event = fullEvent.meta.event;
      const newEvent: ICSEvent = {
        calName: 'NICE Events',
        title: event.name,
        description: event.description,
        status: event.status,
        organizer: { name: event.author },
        start: new Date(event.start).toISOString().split(/(?:-| |T|:|\.)+/),
        end: new Date(event.end).toISOString().split(/(?:-| |T|:|\.)+/),
        location: event.location,
        url: event.url
      };
      exportEvents.push(newEvent);
    }
    const calendar = await createEvents(exportEvents);
    if (!calendar) {
      return;
    }

    const blob = new Blob([calendar], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const date = new Date().toISOString().split('T')[0].split('-');

    const a = document.createElement('a');
    document.body.appendChild(a);
    a.href = url;
    a.download = `NICE_EVENTS_${date[2]}_${date[1]}_${date[0]}.ics`;
    a.click();
  }
}

const formatDate = (dt: string[]) =>
  `${dt[0]}${dt[1]}${dt[2]}T${dt[3]}${dt[4]}${dt[5]}`;

const createEvents = async (exportEvents: ICSEvent[]): Promise<string> => {
  /* cSpell:disable */
  const calendarName = 'NICE Events';
  const dt = new Date().toISOString().split(/(?:-| |T|:|\.)+/);
  const dtStamp = formatDate(dt);

  let finalString = 'BEGIN:VCALENDAR\n';
  finalString += 'VERSION:2.0\n';
  finalString += 'CALSCALE:GREGORIAN\n';
  finalString += 'PRODID:adamgibbons/ics\n';
  finalString += `X-WR-CALNAME:${calendarName}\n`;
  finalString += 'X-PUBLISHED-TTL:PT1H\n';

  for (const element of exportEvents) {
    const dtStart = formatDate(element.start);
    const dtEnd = formatDate(element.end);

    finalString += 'BEGIN:VEVENT\n';
    finalString += `SUMMARY:${element.title}\n`;
    finalString += `DTSTAMP:${dtStamp}\n`;
    finalString += `DTSTART:${dtStart}\n`;
    finalString += `DTEND:${dtEnd}\n`;
    finalString += `DESCRIPTION:${element.description}\n`;
    finalString += `URL:${element.url}\n`;
    finalString += `LOCATION:${element.location}\n`;
    finalString += `STATUS:${element.status}\n`;
    finalString += `ORGANIZER;CN=${element.organizer.name}\n`;
    finalString += 'END:VEVENT\n';
  }

  finalString += '\nEND:VCALENDAR';
  /* cSpell:enable */
  return finalString;
};
