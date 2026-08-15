import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Button } from '../../components/button/button';
import { Item } from '../../services/items-service';

@Component({
  selector: 'app-browse',
  imports: [CurrencyPipe, Button],
  templateUrl: './browse.html',
})
export class Browse {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly items = this.route.snapshot.data['items'] as Item[];

  viewItem(id: number): void {
    void this.router.navigateByUrl(`/items/${id}`);
  }
}
