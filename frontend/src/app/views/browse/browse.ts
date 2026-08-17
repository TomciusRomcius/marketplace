import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { distinctUntilChanged, map } from 'rxjs';
import { Button } from '../../components/button/button';
import { CursorPaginator } from '../../components/cursor-paginator/cursor-paginator';
import { Search } from '../../components/search/search';
import { Item, ItemsService } from '../../services/items-service';

@Component({
  selector: 'app-browse',
  imports: [CurrencyPipe, Button, CursorPaginator, Search],
  templateUrl: './browse.html',
})
export class Browse {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly itemsService = inject(ItemsService);

  readonly items = signal<Item[]>([]);
  readonly anyAdditionalRecords = signal(false);
  readonly loading = signal(false);

  readonly nextCursorId = computed(() => {
    const list = this.items();
    return list.length > 0 ? list[list.length - 1]!.id : 0;
  });

  constructor() {
    this.route.queryParamMap
      .pipe(
        map((params) => params.get('searchText') ?? ''),
        distinctUntilChanged(),
        takeUntilDestroyed(),
      )
      .subscribe((searchText) => {
        this.fetchItems(0, searchText, true);
      });
  }

  viewItem(id: number): void {
    void this.router.navigateByUrl(`/items/${id}`);
  }

  onLoadMore(cursorId: number): void {
    if (this.loading() || this.anyAdditionalRecords()) {
      return;
    }

    const searchText = this.route.snapshot.queryParamMap.get('searchText');
    this.fetchItems(cursorId, searchText, false);
  }

  private fetchItems(
    cursorId: number,
    searchText: string | null,
    replace: boolean,
  ): void {
    this.loading.set(true);
    if (replace) {
      this.anyAdditionalRecords.set(false);
    }

    this.itemsService.getItems(cursorId, searchText).subscribe({
      next: (page) => {
        this.anyAdditionalRecords.set(page.length === 0);

        if (replace) {
          this.items.set(page);
        } else if (page.length > 0) {
          this.items.update((existing) => [...existing, ...page]);
        }

        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }
}
