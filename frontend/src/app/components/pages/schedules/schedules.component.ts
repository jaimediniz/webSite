import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/app/services/backend.service';
import { Event } from '../../../interfaces/database';

@Component({
  selector: 'app-schedules',
  templateUrl: './schedules.component.html',
  styleUrls: ['./schedules.component.scss']
})
export class SchedulesComponent implements OnInit {
  public events: Array<Event>;

  constructor(private api: APIService) {
    this.api.getEvents().then((response: any) => {
      console.log(response);
      this.events = response.message;
    });
  }

  ngOnInit(): void {}
}
