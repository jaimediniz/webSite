import { ReturnStatement } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { CalendarView } from 'angular-calendar';
import { CalendarEvent } from 'calendar-utils';
import * as ics from 'ics';
import { isSameMonth, isSameDay } from 'date-fns';

import { APIService } from 'src/app/services/backend.service';
import { Event } from '../../../interfaces/database';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {
  viewDate: Date = new Date();
  events: CalendarEvent<any>[];
  view: CalendarView = CalendarView.Month;
  calendarView = CalendarView;
  activeDayIsOpen = false;

  public hideExportButton = true;

  constructor(private api: APIService) {
    this.api.getEvents().then((response: any) => {
      console.log(response);
      this.events = response.message.map((event: Event) => ({
        title: event.name,
        start: new Date(event.start),
        color: '#fff',
        allDay: true,
        meta: {
          event
        }
      }));
      this.hideExportButton = false;
    });
  }

  ngOnInit(): void {}

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
    window.open(event?.meta?.event.url ?? '', '_blank');
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
