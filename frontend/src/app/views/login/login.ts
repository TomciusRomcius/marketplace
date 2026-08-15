import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { Button } from '../../components/button/button';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, Button],
  templateUrl: './login.html',
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
