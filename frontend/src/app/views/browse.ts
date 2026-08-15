import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Item } from '../services/items-service';

@Component({
  selector: 'app-browse',
  imports: [CurrencyPipe],
  template: `
    <div class="min-h-screen bg-slate-50 px-4 py-8">
      <div class="mx-auto max-w-7xl">
        <h1 class="mb-6 text-2xl font-semibold text-slate-900">Browse</h1>

        @if (items.length === 0) {
          <p class="text-slate-600">No items available.</p>
        } @else {
          <div class="grid grid-cols-8 gap-4">
            @for (item of items; track item.id) {
              <article
                class="flex flex-col rounded-lg border border-slate-200 bg-white p-3 shadow-sm"
              >
                <h2
                  class="mb-1 line-clamp-2 text-sm font-medium text-slate-900"
                >
                  {{ item.title }}
                </h2>
                <p class="mb-3 line-clamp-3 flex-1 text-xs text-slate-600">
                  {{ item.description }}
                </p>
                <p class="text-sm font-semibold text-slate-900">
                  {{ item.price_cents / 100 | currency }}
                </p>
              </article>
            }
          </div>
        }
      </div>
    </div>
  `,
})
export class Browse {
  private readonly route = inject(ActivatedRoute);

  readonly items = this.route.snapshot.data['items'] as Item[];
}
