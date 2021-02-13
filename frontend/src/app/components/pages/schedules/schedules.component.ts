import { ReturnStatement } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import * as ics from 'ics';

import { APIService } from 'src/app/services/backend.service';
import { Event } from '../../../interfaces/database';

@Component({
  selector: 'app-schedules',
  templateUrl: './schedules.component.html',
  styleUrls: ['./schedules.component.scss']
})
export class SchedulesComponent implements OnInit {
  public events: Array<Event>;
  public hideExportButton = true;

  constructor(private api: APIService) {
    this.api.getEvents().then((response: any) => {
      console.log(response);
      this.events = response.message;
      this.hideExportButton = false;
    });
  }

  ngOnInit(): void {}

  exportSchedule() {
    let exportEvents: any = [];
    let processedItems = 0;
    this.events.forEach((event) => {
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
