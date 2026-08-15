import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Item } from '../../services/items-service';

@Component({
  selector: 'app-browse',
  imports: [CurrencyPipe],
  templateUrl: './browse.html',
})
export class Browse {
  private readonly route = inject(ActivatedRoute);

  readonly items = this.route.snapshot.data['items'] as Item[];
}
