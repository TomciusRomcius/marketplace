import {
  afterNextRender,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-cursor-paginator',
  templateUrl: './cursor-paginator.html',
})
export class CursorPaginator implements OnDestroy {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  /** Last item id from the current list; used as the next `cursor_id` query param. */
  readonly nextCursorId = input.required<number>();

  /**
   * Set to `true` when the latest page returns an empty `items` array.
   * When true, pagination stops and the spinner is hidden.
   */
  readonly anyAdditionalRecords = input(false);

  private observer: IntersectionObserver | null = null;
  private lastNavigatedCursorId: number | null = null;

  constructor() {
    afterNextRender(() => this.setupObserver());

    effect(() => {
      this.nextCursorId();
      this.anyAdditionalRecords();
      this.lastNavigatedCursorId = null;
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
        if (nextCursorId <= 0 || nextCursorId === this.lastNavigatedCursorId) {
          return;
        }

        this.lastNavigatedCursorId = nextCursorId;
        void this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { cursor_id: nextCursorId },
          queryParamsHandling: 'merge',
        });
      },
      { root: null, rootMargin: '0px', threshold: 0 },
    );

    this.observer.observe(this.elementRef.nativeElement);
  }
}
