import { CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Button } from '../../components/button/button';
import { ImageCarousel } from '../../components/image-carousel/image-carousel';
import { Item as ItemModel } from '../../services/items-service';
import { PurchasesService } from '../../services/purchases-service';

@Component({
  selector: 'app-item',
  imports: [CurrencyPipe, Button, ImageCarousel],
  templateUrl: './item.html',
})
export class Item {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly purchasesService = inject(PurchasesService);

  readonly item = this.route.snapshot.data['item'] as ItemModel;
  readonly imageUrls = this.item.image_urls ?? [];
  readonly purchasing = signal(false);
  readonly error = signal<string | null>(null);

  onBuy(): void {
    this.error.set(null);
    this.purchasing.set(true);

    this.purchasesService.purchaseItem(this.item.id).subscribe({
      next: () => {
        this.purchasing.set(false);
        void this.router.navigateByUrl('/browse');
      },
      error: (err: HttpErrorResponse) => {
        this.purchasing.set(false);
        this.error.set(
          err.error?.message ?? 'Unable to purchase item. Please try again.',
        );
      },
    });
  }
}
