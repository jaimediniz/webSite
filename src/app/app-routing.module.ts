import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/pages/home/home.component';
import { AboutComponent } from './components/pages/about/about.component';
import { ScheduleComponent } from './components/pages/schedule/schedule.component';
import { ChatComponent } from './components/pages/chat/chat.component';
import { FeedbackComponent } from './components/pages/feedback/feedback.component';
import { AdminComponent } from './components/pages/admin/admin.component';
import { RegisterComponent } from './components/pages/register/register.component';

import { AdminGuard } from 'src/app/guard/admin';
import { ActivitiesComponent } from './components/pages/activities/activities.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'schedule', component: ScheduleComponent },
  { path: 'activities', component: ActivitiesComponent },
  {
    path: 'register/:form',
    component: RegisterComponent,
    pathMatch: 'full'
  },
  { path: 'chat', component: ChatComponent },
  { path: 'feedback', component: FeedbackComponent },
  { path: 'admin', component: AdminComponent, canActivate: [AdminGuard] },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: 'reload'
    })
  ],
  exports: [RouterModule],
  providers: [AdminGuard]
})
export class AppRoutingModule {}
