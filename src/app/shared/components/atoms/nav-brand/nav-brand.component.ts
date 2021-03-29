import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DarkService } from '@app/shared/services/dark.service';

@Component({
  selector: 'app-nav-brand',
  templateUrl: './nav-brand.component.html',
  styleUrls: ['./nav-brand.component.scss']
})
export class NavBrandComponent implements OnInit {
  public isDarkMode = false;

  constructor(private darkService: DarkService) {
    this.isDarkMode = this.darkService.darkTheme;
    this.darkService.darkThemeEmitter.subscribe((darkTheme: boolean) => {
      this.isDarkMode = darkTheme;
    });
  }

  ngOnInit(): void {}

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.darkService.darkMode(this.isDarkMode);
  }
}
