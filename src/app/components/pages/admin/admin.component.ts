import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/app/services/backend.service';
import { SweetAlertService } from 'src/app/services/sweetAlert.service';
import { Event, User } from 'src/interfaces/database';

type Editing = {
  [key: number]: boolean;
};

interface Collection {
  name: string;
  properties: any[];
}
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  public editing: Editing = {};
  public collections: Collection[] = [
    {
      name: 'Users',
      properties: ['name', 'username', 'role']
    },
    {
      name: 'Events',
      properties: [
        'name',
        'description',
        'location',
        'status',
        'author',
        'start',
        'end'
      ]
    }
  ];
  public selectedCollection: Collection = this.collections[0];
  public table: any[];

  constructor(private api: APIService, private alert: SweetAlertService) {
    this.getTable();
  }

  ngOnInit(): void {}

  async getTable(): Promise<void> {
    this.table = [];
    this.editing = [];

    if (this.selectedCollection.name === 'Users') {
      this.table = await this.api.getUsers();
      return;
    }

    if (this.selectedCollection.name === 'Events') {
      this.table = await this.api.getEvents();
      return;
    }
  }

  isObjectEqual(obj1: any, obj2: any) {
    return Object.keys(obj1).every((prop: string) => obj1[prop] === obj2[prop]);
  }

  async displayInfoCard(element: User | Event) {
    const result = await this.alert.displayDbElement(element as Event);
    if (result && !this.isObjectEqual(result, element)) {
      console.log(result);
      // TODO: Update object in DB
    }
  }

  deleteElement(element: User | Event) {
    // TODO: Remove from database
    console.log(element);
    const index = this.table.indexOf(element as any);
    this.table.splice(index, 1);
  }

  // startEditElement(id: number, element: User | Event) {
  //   this.editing[id] = true;
  // }

  // finishEditElement(id: number, element: User | Event) {
  //   // TODO: Edit on database
  //   delete this.editing[id];
  // }

  // cancelEditElement(id: number, element: User | Event) {
  //   // TODO: Edit on database
  //   delete this.editing[id];
  // }
}
