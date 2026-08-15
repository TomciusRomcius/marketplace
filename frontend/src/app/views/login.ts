import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../services/auth-service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <form
        class="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm"
        [formGroup]="form"
        (ngSubmit)="onSubmit()"
        novalidate
      >
        <h1 class="mb-6 text-center text-2xl font-semibold text-slate-900">
          Sign in
        </h1>

        <div class="mb-4">
          <label
            for="email"
            class="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            formControlName="email"
            autocomplete="email"
            class="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
            [class.border-red-500]="emailInvalid"
            [class.focus:border-red-500]="emailInvalid"
            [class.focus:ring-red-500/30]="emailInvalid"
          />
          @if (emailInvalid) {
            <p class="mt-1.5 text-sm text-red-600">
              @if (form.controls.email.hasError('required')) {
                Email is required.
              } @else if (form.controls.email.hasError('email')) {
                Enter a valid email address.
              }
            </p>
          }
        </div>

        <div class="mb-6">
          <label
            for="password"
            class="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            formControlName="password"
            autocomplete="current-password"
            class="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
            [class.border-red-500]="passwordInvalid"
            [class.focus:border-red-500]="passwordInvalid"
            [class.focus:ring-red-500/30]="passwordInvalid"
          />
          @if (passwordInvalid) {
            <p class="mt-1.5 text-sm text-red-600">
              @if (form.controls.password.hasError('required')) {
                Password is required.
              } @else if (form.controls.password.hasError('minlength')) {
                Password must be at least 6 characters.
              }
            </p>
          }
        </div>

        @if (serverError()) {
          <p class="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {{ serverError() }}
          </p>
        }

        <button
          type="submit"
          class="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          [disabled]="submitting()"
        >
          {{ submitting() ? 'Signing in…' : 'Sign in' }}
        </button>
      </form>
    </div>
  `,
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);

  readonly submitting = signal(false);
  readonly serverError = signal<string | null>(null);
  readonly submitted = signal(false);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  get emailInvalid(): boolean {
    const control = this.form.controls.email;
    return control.invalid && (control.touched || this.submitted());
  }

  get passwordInvalid(): boolean {
    const control = this.form.controls.password;
    return control.invalid && (control.touched || this.submitted());
  }

  onSubmit(): void {
    this.submitted.set(true);
    this.serverError.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password } = this.form.getRawValue();
    this.submitting.set(true);

    this.auth.signIn(email, password).subscribe({
      next: () => {
        this.submitting.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.submitting.set(false);
        this.serverError.set(
          err.error?.error ?? 'Unable to sign in. Please try again.',
        );
      },
    });
  }
}
