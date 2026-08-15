import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Item, ItemsService } from '../services/items-service';

export const itemsResolver: ResolveFn<Item[]> = (route) => {
  const cursorId = Number(route.queryParamMap.get('cursor_id') ?? 0);
  return inject(ItemsService).getItems(Number.isFinite(cursorId) ? cursorId : 0);
};
