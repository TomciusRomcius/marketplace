import { CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Button } from '../../components/button/button';
import {
  Item,
  ItemStatus,
  ItemsService,
} from '../../services/items-service';

@Component({
  selector: 'app-my-items',
  imports: [CurrencyPipe, Button],
  templateUrl: './my-items.html',
})
export class MyItems {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly itemsService = inject(ItemsService);

  readonly items = signal(this.route.snapshot.data['items'] as Item[]);
  readonly deletingId = signal<number | null>(null);
  readonly updatingId = signal<number | null>(null);
  readonly error = signal<string | null>(null);

  listNewItem(): void {
    void this.router.navigateByUrl('/list-item');
  }

  onUpdateStatus(id: number, status: Exclude<ItemStatus, 'sold'>): void {
    this.error.set(null);
    this.updatingId.set(id);

    this.itemsService.updateItem(id, { status }).subscribe({
      next: () => {
        this.items.update((list) =>
          list.map((item) => (item.id === id ? { ...item, status } : item)),
        );
        this.updatingId.set(null);
      },
      error: (err: HttpErrorResponse) => {
        this.updatingId.set(null);
        this.error.set(
          err.error?.error ?? 'Unable to update item. Please try again.',
        );
      },
    });
  }

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
