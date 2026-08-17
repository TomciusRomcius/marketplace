import { Component, computed, input, signal } from '@angular/core';

@Component({
  selector: 'app-image-carousel',
  templateUrl: './image-carousel.html',
})
export class ImageCarousel {
  readonly imageUrls = input.required<string[]>();

  readonly currentIndex = signal(0);

  readonly currentImageUrl = computed(() => {
    const urls = this.imageUrls();
    const index = this.currentIndex();
    return urls[index] ?? null;
  });

  hasPrevImage(): boolean {
    return this.currentIndex() > 0;
  }

  hasNextImage(): boolean {
    return this.currentIndex() < this.imageUrls().length - 1;
  }

  goToPrev(): void {
    if (!this.hasPrevImage()) {
      return;
    }
    this.currentIndex.update((index) => index - 1);
  }

  goToNext(): void {
    if (!this.hasNextImage()) {
      return;
    }
    this.currentIndex.update((index) => index + 1);
  }

  goToIndex(index: number): void {
    if (index < 0 || index >= this.imageUrls().length) {
      return;
    }
    this.currentIndex.set(index);
  }
}
