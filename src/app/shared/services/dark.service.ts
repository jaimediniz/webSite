import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DarkService {
  public darkThemeEmitter: EventEmitter<boolean> = new EventEmitter(false);
  public darkTheme = false;

  constructor() {
    this.darkTheme = JSON.parse(localStorage.getItem('isDarkMode') ?? 'false');
  }

  darkMode(darkMode: boolean) {
    this.darkTheme = darkMode;
    this.darkThemeEmitter.emit(darkMode);
    localStorage.setItem('isDarkMode', JSON.stringify(darkMode));
  }
}
