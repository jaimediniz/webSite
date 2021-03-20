import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { CookieModule } from 'ngx-cookie';

import { SharedAppModule } from './shared/shared.module';
import { MaterialModule } from './material.module';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { environment } from '../environments/environment';

import { LoggerService } from './shared/services/logger.service';

import { AppComponent } from './app.component';
import { LoadingComponent } from './shared/components/organisms/loading/loading.component';
import { AppInstallComponent } from './shared/components/organisms/external/external.component';
import { FooterComponent } from './shared/components/organisms/footer/footer.component';

import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ScheduleComponent } from './pages/schedule/schedule.component';
import { ChatComponent } from './pages/chat/chat.component';
import { FeedbackComponent } from './pages/feedback/feedback.component';
import { RegisterComponent } from './pages/register/register.component';
import { ActivitiesComponent } from './pages/activities/activities.component';
import { AdminComponent } from './pages/admin/admin.component';

@NgModule({
  declarations: [
    HomeComponent,
    AboutComponent,
    AppComponent,
    FooterComponent,
    AppInstallComponent,
    LoadingComponent,
    ScheduleComponent,
    ChatComponent,
    FeedbackComponent,
    RegisterComponent,
    ActivitiesComponent,
    AdminComponent
  ],
  imports: [
    MaterialModule,
    BrowserModule,
    CommonModule,
    SharedAppModule,
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
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    CookieModule.forRoot()
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
