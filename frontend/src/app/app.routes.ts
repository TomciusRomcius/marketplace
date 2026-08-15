import { Routes } from '@angular/router';
import { Login } from './views/login';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
];
