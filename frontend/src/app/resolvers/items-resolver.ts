import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Item, ItemsService } from '../services/items-service';

export const itemsResolver: ResolveFn<Item[]> = () => {
  return inject(ItemsService).getItems();
};
