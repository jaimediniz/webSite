import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
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
import { LoadingInterceptorService } from './shared/loading-interceptor.service';
import { MaterialModule } from './material.module';
import { LogPublishersService } from './shared/log-publishers.service';
import { LoggerService } from './services/logger.service';
import { SchedulesComponent } from './components/pages/schedules/schedules.component';

@NgModule({
  declarations: [
    HomeComponent,
    AboutComponent,
    NavbarComponent,
    AppComponent,
    FooterComponent,
    AppInstallComponent,
    LoadingComponent,
    SchedulesComponent
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
    })
  ],
  exports: [
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptorService,
      multi: true
    },
    LoggerService,
    LogPublishersService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
