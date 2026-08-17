import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Item, ItemsService } from '../services/items-service';

export const itemResolver: ResolveFn<Item> = (route) => {
  const id = Number(route.paramMap.get('id'));
  return inject(ItemsService).getItem(id);
};
