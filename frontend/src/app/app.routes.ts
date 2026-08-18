import { Routes } from '@angular/router';
import { itemResolver } from './resolvers/item-resolver';
import { myItemsResolver } from './resolvers/my-items-resolver';
import { myPurchasesResolver } from './resolvers/my-purchases-resolver';
import { Browse } from './views/browse/browse';
import { Item } from './views/item/item';
import { ListItem } from './views/list-item/list-item';
import { Login } from './views/login/login';
import { MyItems } from './views/my-items/my-items';
import { MyPurchases } from './views/my-purchases/my-purchases';
import { Signup } from './views/signup/signup';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
  {
    path: 'browse',
    component: Browse,
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
  {
    path: 'my-purchases',
    component: MyPurchases,
    resolve: { purchases: myPurchasesResolver },
  },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
];
