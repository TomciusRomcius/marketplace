import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Button } from '../../components/button/button';
import { ImageCarousel } from '../../components/image-carousel/image-carousel';
import { Item as ItemModel } from '../../services/items-service';

@Component({
  selector: 'app-item',
  imports: [CurrencyPipe, Button, ImageCarousel],
  templateUrl: './item.html',
})
export class Item {
  private readonly route = inject(ActivatedRoute);

  readonly item = this.route.snapshot.data['item'] as ItemModel;
  readonly imageUrls = this.item.image_urls ?? [];
}
