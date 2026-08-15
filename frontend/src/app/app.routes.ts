import { Routes } from '@angular/router';
import { itemsResolver } from './resolvers/items-resolver';
import { myItemsResolver } from './resolvers/my-items-resolver';
import { Browse } from './views/browse';
import { ListItem } from './views/list-item';
import { Login } from './views/login';
import { MyItems } from './views/my-items';
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
  {
    path: 'my-items',
    component: MyItems,
    resolve: { items: myItemsResolver },
  },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
];
