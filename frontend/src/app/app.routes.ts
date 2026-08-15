import { Routes } from '@angular/router';
import { Login } from './views/login';
import { Signup } from './views/signup';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
];
