import { Routes } from '@angular/router';
import { itemsResolver } from './resolvers/items-resolver';
import { Browse } from './views/browse';
import { ListItem } from './views/list-item';
import { Login } from './views/login';
import { Signup } from './views/signup';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
  {
    path: 'browse',
    component: Browse,
    resolve: { items: itemsResolver },
  },
  { path: 'list-item', component: ListItem },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
];
