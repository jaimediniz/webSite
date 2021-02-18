import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/app/services/backend.service';
import { User } from 'src/interfaces/database';

type Editing = {
  [key: string]: boolean;
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
    //{ name: 'Subscriptions', properties: ['c', 'd'] },
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

  constructor(private api: APIService) {
    this.getTable(this.selectedCollection);
  }

  ngOnInit(): void {}

  async getTable(collection: Collection): Promise<void> {
    console.log('ok');
    this.table = [];
    if (collection.name === 'Users') {
      this.table = await this.api.getUsers();
      return;
    }

    if (collection.name === 'Subscriptions') {
      this.table = await this.api.getUsers();
      return;
    }

    if (collection.name === 'Events') {
      this.table = await this.api.getEvents();
      return;
    }
  }

  deleteElement(element: any) {
    // TODO: Remove from database
    const index = this.table.indexOf(element);
    this.table.splice(index, 1);
  }

  startEditElement(id: number, element: any) {
    this.editing[id + ''] = true;
  }

  finishEditElement(id: number, element: any) {
    // TODO: Edit on database
    delete this.editing[id + ''];
  }

  cancelEditElement(id: number, element: any) {
    // TODO: Edit on database
    delete this.editing[id + ''];
  }
}
