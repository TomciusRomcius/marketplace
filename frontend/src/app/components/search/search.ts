import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.html',
})
export class Search {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly searchText = signal(
    this.route.snapshot.queryParamMap.get('searchText') ?? '',
  );

  private readonly searchText$ = toObservable(this.searchText).pipe(
    debounceTime(300),
    distinctUntilChanged(),
    takeUntilDestroyed(),
  );

  constructor() {
    this.searchText$.subscribe((value) => {
      const current = this.route.snapshot.queryParamMap.get('searchText') ?? '';
      if (value === current) {
        return;
      }

      void this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          searchText: value || null,
        },
        queryParamsHandling: 'merge',
      });
    });
  }

  onInput(event: Event): void {
    this.searchText.set((event.target as HTMLInputElement).value);
  }
}
