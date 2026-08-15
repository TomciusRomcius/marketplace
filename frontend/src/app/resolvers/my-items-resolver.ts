import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Item, ItemsService } from '../services/items-service';

export const myItemsResolver: ResolveFn<Item[]> = () => {
  return inject(ItemsService).getMyItems();
};
