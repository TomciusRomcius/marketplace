import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Button } from '../../components/button/button';
import { CursorPaginator } from '../../components/cursor-paginator/cursor-paginator';
import { Item } from '../../services/items-service';

@Component({
  selector: 'app-browse',
  imports: [CurrencyPipe, Button, CursorPaginator],
  templateUrl: './browse.html',
})
export class Browse {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly items = signal<Item[]>([]);
  readonly anyAdditionalRecords = signal(false);

  readonly nextCursorId = computed(() => {
    const list = this.items();
    return list.length > 0 ? list[list.length - 1]!.id : 0;
  });

  constructor() {
    this.route.data.subscribe((data) => {
      const page = data['items'] as Item[];
      const cursorId = Number(
        this.route.snapshot.queryParamMap.get('cursor_id') ?? 0,
      );
      if (this.items().length === 0 && cursorId != 0) {
        this.router.navigate([], {
          queryParams: { cursor_id: null }
        })
      }
      this.applyPage(page, cursorId);
    });
  }

  viewItem(id: number): void {
    void this.router.navigateByUrl(`/items/${id}`);
  }

  private applyPage(page: Item[], cursorId: number): void {
    this.anyAdditionalRecords.set(page.length === 0);

    if (page.length === 0) {
      return;
    }

    if (!cursorId) {
      this.items.set(page);
      return;
    }

    this.items.update((existing) => {
      return [...existing, ...page]
    });
  }
}
