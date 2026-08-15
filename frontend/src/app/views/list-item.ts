import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { Button } from '../components/button/button';
import { FormField } from '../components/form-field/form-field';
import { ImageUpload } from '../components/list-item/image-upload/image-upload';
import { ItemPhotosService } from '../services/item-photos-service';
import { ItemsService } from '../services/items-service';

@Component({
  selector: 'app-list-item',
  imports: [ReactiveFormsModule, Button, FormField, ImageUpload],
  template: `
    <div class="min-h-screen bg-slate-50 px-4 py-8">
      <div class="mx-auto w-full max-w-2xl">
        <form
          class="rounded-xl border border-slate-200 bg-white p-8 shadow-sm"
          [formGroup]="form"
          (ngSubmit)="onSubmit()"
          novalidate
        >
          <h1 class="mb-6 text-2xl font-semibold text-slate-900">
            List an item
          </h1>

          <app-form-field
            label="Title"
            type="text"
            [control]="titleControl"
            [submitted]="submitted()"
            [errorMessages]="{
              required: 'Title is required.',
              minlength: 'Title must be at least 8 characters.',
              maxlength: 'Title must be at most 64 characters.',
            }"
          />

          <app-form-field
            label="Description"
            type="textarea"
            [control]="descriptionControl"
            [submitted]="submitted()"
            [errorMessages]="{
              required: 'Description is required.',
              minlength: 'Description must be at least 8 characters.',
              maxlength: 'Description must be at most 255 characters.',
            }"
          />

          <app-form-field
            label="Price"
            type="number"
            [control]="priceControl"
            [submitted]="submitted()"
            [errorMessages]="{
              required: 'Price is required.',
              min: 'Price must be at least 0.',
            }"
          />

          <div class="mb-6">
            <p class="mb-1.5 text-sm font-medium text-slate-700">Photos</p>
            <app-image-upload
              [(files)]="photos"
              [disabled]="submitting()"
            />
          </div>

          @if (serverError()) {
            <p class="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {{ serverError() }}
            </p>
          }

          <app-button type="accent" htmlType="submit" [disabled]="submitting()">
            {{ submitting() ? 'Listing…' : 'List item' }}
          </app-button>
        </form>
      </div>
    </div>
  `,
})
export class ListItem {
  private readonly fb = inject(FormBuilder);
  private readonly items = inject(ItemsService);
  private readonly itemPhotos = inject(ItemPhotosService);
  private readonly router = inject(Router);

  readonly submitting = signal(false);
  readonly serverError = signal<string | null>(null);
  readonly submitted = signal(false);
  readonly photos = signal<File[]>([]);

  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(64)]],
    description: [
      '',
      [Validators.required, Validators.minLength(8), Validators.maxLength(255)],
    ],
    price: [0, [Validators.required, Validators.min(0)]],
  });

  get titleControl(): FormControl<string> {
    return this.form.controls.title;
  }

  get descriptionControl(): FormControl<string> {
    return this.form.controls.description;
  }

  get priceControl(): FormControl<number> {
    return this.form.controls.price;
  }

  onSubmit(): void {
    this.submitted.set(true);
    this.serverError.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { title, description, price } = this.form.getRawValue();
    const priceCents = Math.round(price * 100);
    const files = this.photos();

    this.submitting.set(true);

    this.items
      .createItem({
        title,
        description,
        price_cents: priceCents,
      })
      .pipe(
        switchMap(({ id }) =>
          files.length > 0
            ? this.itemPhotos.uploadPhotos(id, files)
            : of(undefined),
        ),
      )
      .subscribe({
        next: () => {
          this.submitting.set(false);
          void this.router.navigateByUrl('/browse');
        },
        error: (err: HttpErrorResponse) => {
          this.submitting.set(false);
          this.serverError.set(this.formatServerError(err));
        },
      });
  }

  private formatServerError(err: HttpErrorResponse): string {
    const errors = err.error?.errors;
    if (errors && typeof errors === 'object') {
      const messages = Object.entries(errors).flatMap(([field, msgs]) => {
        const list = Array.isArray(msgs) ? msgs : [String(msgs)];
        return list.map((msg) => `${field} ${msg}`);
      });
      if (messages.length > 0) {
        return messages.join('. ');
      }
    }

    return err.error?.error ?? 'Unable to list item. Please try again.';
  }
}
