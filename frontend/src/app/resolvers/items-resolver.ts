import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Item, ItemsService } from '../services/items-service';

export const itemsResolver: ResolveFn<Item[]> = (route) => {
  const cursorId = Number(route.queryParamMap.get('cursor_id') ?? 0);
  const searchText = route.queryParamMap.get('searchText');
  return inject(ItemsService).getItems(
    Number.isFinite(cursorId) ? cursorId : 0,
    searchText,
  );
};
