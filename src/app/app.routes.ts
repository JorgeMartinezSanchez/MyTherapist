import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { authGuard } from '../guard/auth/auth.guard';
import { TodayMenuComponent } from './home/today-menu/today-menu.component';
import { CalendarComponent } from './home/calendar/calendar.component';
import { CreateTurnComponent } from './home/create-turn/create-turn.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: 'home', 
    component: HomeComponent,
    canActivate: [authGuard],
    children:[
      {
        path: 'today',
        component: TodayMenuComponent
      },
      {
        path: 'calendar',
        component: CalendarComponent
      }
    ]
  },
  {
    path: 'home/new-turn',
    component: CreateTurnComponent
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];