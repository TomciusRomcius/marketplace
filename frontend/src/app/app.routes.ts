import { Routes } from '@angular/router';
import { itemResolver } from './resolvers/item-resolver';
import { itemsResolver } from './resolvers/items-resolver';
import { myItemsResolver } from './resolvers/my-items-resolver';
import { Browse } from './views/browse/browse';
import { Item } from './views/item/item';
import { ListItem } from './views/list-item/list-item';
import { Login } from './views/login/login';
import { MyItems } from './views/my-items/my-items';
import { Signup } from './views/signup/signup';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
  {
    path: 'browse',
    component: Browse,
    resolve: { items: itemsResolver },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
  },
  {
    path: 'items/:id',
    component: Item,
    resolve: { item: itemResolver },
  },
  { path: 'list-item', component: ListItem },
  {
    path: 'my-items',
    component: MyItems,
    resolve: { items: myItemsResolver },
  },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
];
