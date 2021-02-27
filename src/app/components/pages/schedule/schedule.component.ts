import { Component, OnDestroy, OnInit } from '@angular/core';
import { CalendarEventTitleFormatter, CalendarView } from 'angular-calendar';
import { CalendarEvent } from 'calendar-utils';
import * as ics from 'ics';
import { isSameMonth, isSameDay } from 'date-fns';

import { APIService } from 'src/app/services/backend.service';
import { SweetAlertService } from 'src/app/services/sweetAlert.service';

import { Event } from '../../../../interfaces/database';
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

  exportSchedule() {
    const exportEvents: any = [];
    let processedItems = 0;
    this.events.forEach((fullEvent) => {
      const event = fullEvent.meta.event;
      const newEvent = {
        calName: 'NICE Events',
        title: event.name,
        description: event.description,
        status: event.status,
        organizer: { name: event.author },
        start: new Date(event.start)
          .toISOString()
          .split('.')[0]
          .split(/(?:-| |T|:)+/)
          .map((x) => +x),
        end: new Date(event.end)
          .toISOString()
          .split('.')[0]
          .split(/(?:-| |T|:)+/)
          .map((x) => +x),
        location: event.location,
        url: event.url
      };
      exportEvents.push(newEvent);
      processedItems += 1;

      if (processedItems === this.events.length) {
        const { error, value } = ics.createEvents(exportEvents);

        if (error) {
          console.error(error);
          return;
        }

        if (!value) {
          return;
        }

        const blob = new Blob([value], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        const date = new Date().toISOString().split('T')[0].split('-');

        const a = document.createElement('a');
        document.body.appendChild(a);
        a.href = url;
        a.download = `NICE_EVENTS_${date[2]}_${date[1]}_${date[0]}.ics`;
        a.click();
      }
    });
  }
}
