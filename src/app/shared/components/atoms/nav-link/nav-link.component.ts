import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav-link',
  templateUrl: './nav-link.component.html',
  styleUrls: ['./nav-link.component.scss']
})
export class NavLinkComponent implements OnInit {
  @Input() link: string[];
  @Input() icon: string;
  @Input() text: string;

  constructor() {}

  ngOnInit(): void {}
}
