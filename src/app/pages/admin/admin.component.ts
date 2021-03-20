import { Component, OnInit } from '@angular/core';
import { APIService } from '@services/backend.service';
import { SweetAlertService } from '@services/sweetAlert.service';
import { Event, User } from '@interfaces/database';

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
      properties: ['username', 'role']
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
    },
    {
      name: 'External',
      properties: ['key', 'value']
    }
  ];
  public selectedCollection = 0;
  public table: any[];

  constructor(private api: APIService, private alert: SweetAlertService) {
    this.getTable();
  }

  ngOnInit(): void {}

  async getTable(): Promise<void> {
    this.table = [];
    this.editing = [];

    if (this.collections[this.selectedCollection].name === 'Users') {
      this.table = await this.api.getUsers();
      return;
    }

    if (this.collections[this.selectedCollection].name === 'Events') {
      this.table = await this.api.getEvents();
      return;
    }

    if (this.collections[this.selectedCollection].name === 'External') {
      this.table = await this.api.getExternal();
      return;
    }
  }

  isObjectEqual(obj1: any, obj2: any) {
    return Object.keys(obj1).every((prop: string) => obj1[prop] === obj2[prop]);
  }

  async displayInfoCard(element: User | Event) {
    const result = await this.alert.displayDbElement(
      element as Event,
      'Modify'
    );
    if (result && !this.isObjectEqual(result, element)) {
      const response = await this.api.modifyElement(
        result,
        this.collections[this.selectedCollection].name
      );
      if (!response) {
        return;
      }

      this.table = await this.api.cacheUpdate(
        result,
        this.collections[this.selectedCollection].name
      );
    }
  }

  async deleteElement(element: User | Event) {
    const result = await this.api.deleteElement(
      element,
      this.collections[this.selectedCollection].name
    );

    if (!result) {
      return;
    }

    this.table = await this.api.cacheRemove(
      element,
      this.collections[this.selectedCollection].name
    );
  }

  async insertElement() {
    if (this.collections[this.selectedCollection].name === 'Users') {
      const payload = await this.alert.register();

      if (!payload) {
        return;
      }

      const apiResponse = await this.api.register(payload);

      if (!apiResponse) {
        return;
      }

      this.addElementToTable(apiResponse.ops[0], apiResponse.ops[0]);
      return;
    }

    const element = Object.keys(this.table[0]).reduce(
      (acc: any, curr: string, index: number) => ((acc[curr] = ''), acc),
      {}
    );
    // eslint-disable-next-line no-underscore-dangle
    delete element._id;

    const result = await this.alert.displayDbElement(element as Event, 'Add');
    if (!result) {
      return;
    }

    const response = await this.api.insertElement(
      result,
      this.collections[this.selectedCollection].name
    );
    if (!response) {
      return;
    }
    this.addElementToTable(result, response);
  }

  async addElementToTable(element: any, response: any) {
    const newElement = { ...element, _id: response.insertedId };
    this.table = await this.api.cacheInsert(
      newElement,
      this.collections[this.selectedCollection].name
    );
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
