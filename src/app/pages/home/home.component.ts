import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  constructor() {}

  ngOnInit(): void {
    document.getElementById('bg-home')?.classList.add('backgroundImage');
  }

  ngOnDestroy() {
    document.getElementById('bg-home')?.classList.remove('backgroundImage');
  }
}
