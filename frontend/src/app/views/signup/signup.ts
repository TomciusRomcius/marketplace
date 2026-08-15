import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { Button } from '../../components/button/button';
import { AuthService } from '../../services/auth-service';

function passwordMatchValidator(
  group: AbstractControl,
): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirmation = group.get('passwordConfirmation')?.value;
  return password === confirmation ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, RouterLink, Button],
  templateUrl: './signup.html',
})
export class Signup {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly submitting = signal(false);
  readonly serverError = signal<string | null>(null);
  readonly submitted = signal(false);

  readonly form = this.fb.nonNullable.group(
    {
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirmation: ['', [Validators.required]],
    },
    { validators: passwordMatchValidator },
  );

  get emailInvalid(): boolean {
    const control = this.form.controls.email;
    return control.invalid && (control.touched || this.submitted());
  }

  get passwordInvalid(): boolean {
    const control = this.form.controls.password;
    return control.invalid && (control.touched || this.submitted());
  }

  get passwordConfirmationInvalid(): boolean {
    const control = this.form.controls.passwordConfirmation;
    const show = control.touched || this.submitted();
    return show && (control.invalid || this.form.hasError('passwordMismatch'));
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

    this.auth.signUp(email, password).subscribe({
      next: () => {
        this.submitting.set(false);
        void this.router.navigateByUrl('/login');
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
        const label = field === 'email_address' ? 'Email' : field;
        const list = Array.isArray(msgs) ? msgs : [String(msgs)];
        return list.map((msg) => `${label} ${msg}`);
      });
      if (messages.length > 0) {
        return messages.join('. ');
      }
    }

    return err.error?.error ?? 'Unable to create account. Please try again.';
  }
}
