import {
  afterNextRender,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  output,
} from '@angular/core';

@Component({
  selector: 'app-cursor-paginator',
  templateUrl: './cursor-paginator.html',
})
export class CursorPaginator implements OnDestroy {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  /** Last item id from the current list; emitted as the next page cursor. */
  readonly nextCursorId = input.required<number>();

  /**
   * Set to `true` when the latest page returns an empty `items` array.
   * When true, pagination stops and the spinner is hidden.
   */
  readonly anyAdditionalRecords = input(false);

  readonly loadMore = output<number>();

  private observer: IntersectionObserver | null = null;
  private lastEmittedCursorId: number | null = null;

  constructor() {
    afterNextRender(() => this.setupObserver());

    effect(() => {
      this.nextCursorId();
      this.anyAdditionalRecords();
      this.lastEmittedCursorId = null;
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.observer = null;
  }

  private setupObserver(): void {
    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || this.anyAdditionalRecords()) {
          return;
        }

        const nextCursorId = this.nextCursorId();
        if (nextCursorId <= 0 || nextCursorId === this.lastEmittedCursorId) {
          return;
        }

        this.lastEmittedCursorId = nextCursorId;
        this.loadMore.emit(nextCursorId);
      },
      { root: null, rootMargin: '0px', threshold: 0 },
    );

    this.observer.observe(this.elementRef.nativeElement);
  }
}
