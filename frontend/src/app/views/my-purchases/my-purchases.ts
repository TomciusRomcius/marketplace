import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Purchase } from '../../services/purchases-service';

@Component({
  selector: 'app-my-purchases',
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './my-purchases.html',
})
export class MyPurchases {
  private readonly route = inject(ActivatedRoute);

  readonly purchases = signal(
    this.route.snapshot.data['purchases'] as Purchase[],
  );
}
