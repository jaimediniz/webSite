import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { HomeComponent } from './components/pages/home/home.component';
import { AboutComponent } from './components/pages/about/about.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { FooterComponent } from './components/footer/footer.component';
import { AppInstallComponent } from './components/external/external.component';
import { LoadingComponent } from './components/loading/loading.component';
import { MaterialModule } from './material.module';
import { LoggerService } from './services/logger.service';
import { ScheduleComponent } from './components/pages/schedule/schedule.component';
import { ChatComponent } from './components/pages/chat/chat.component';
import { FeedbackComponent } from './components/pages/feedback/feedback.component';
import { RegisterComponent } from './components/pages/register/register.component';
import { ActivitiesComponent } from './components/pages/activities/activities.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

@NgModule({
  declarations: [
    HomeComponent,
    AboutComponent,
    NavbarComponent,
    AppComponent,
    FooterComponent,
    AppInstallComponent,
    LoadingComponent,
    ScheduleComponent,
    ChatComponent,
    FeedbackComponent,
    RegisterComponent,
    ActivitiesComponent
  ],
  imports: [
    MaterialModule,
    BrowserModule,
    CommonModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    ServiceWorkerModule.register('custom-service-worker.js', {
      enabled: environment.production
    }),
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory })
  ],
  exports: [
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule
  ],
  providers: [LoggerService],
  bootstrap: [AppComponent]
})
export class AppModule {}
