import { CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Button } from '../../components/button/button';
import { Item, ItemsService } from '../../services/items-service';

@Component({
  selector: 'app-my-items',
  imports: [CurrencyPipe, Button],
  templateUrl: './my-items.html',
})
export class MyItems {
  private readonly route = inject(ActivatedRoute);
  private readonly itemsService = inject(ItemsService);

  readonly items = signal(this.route.snapshot.data['items'] as Item[]);
  readonly deletingId = signal<number | null>(null);
  readonly error = signal<string | null>(null);

  onDelete(id: number): void {
    this.error.set(null);
    this.deletingId.set(id);

    this.itemsService.deleteItem(id).subscribe({
      next: () => {
        this.items.update((list) => list.filter((item) => item.id !== id));
        this.deletingId.set(null);
      },
      error: (err: HttpErrorResponse) => {
        this.deletingId.set(null);
        this.error.set(
          err.error?.error ?? 'Unable to delete item. Please try again.',
        );
      },
    });
  }
}
