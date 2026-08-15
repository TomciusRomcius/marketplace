import { Component, computed, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

export type FormFieldType =
  | 'text'
  | 'number'
  | 'email'
  | 'password'
  | 'textarea';

const INPUT_CLASSES =
  'w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30';

const INPUT_ERROR_CLASSES =
  'border-red-500 focus:border-red-500 focus:ring-red-500/30';

@Component({
  selector: 'app-form-field',
  imports: [ReactiveFormsModule],
  templateUrl: './form-field.html',
})
export class FormField {
  private static nextId = 0;

  readonly label = input.required<string>();
  readonly type = input<FormFieldType>('text');
  readonly control = input.required<FormControl>();
  readonly submitted = input(false);
  readonly autocomplete = input<string | undefined>(undefined);
  readonly errorMessages = input<Partial<Record<string, string>>>({});

  readonly controlId = `form-field-${FormField.nextId++}`;

  readonly showError = computed(() => {
    const control = this.control();
    return control.invalid && (control.touched || this.submitted());
  });

  readonly fieldClasses = computed(() =>
    this.showError() ? `${INPUT_CLASSES} ${INPUT_ERROR_CLASSES}` : INPUT_CLASSES,
  );

  readonly errorText = computed(() => {
    const errors = this.control().errors;
    if (!errors) {
      return '';
    }

    const messages = this.errorMessages();
    for (const key of Object.keys(errors)) {
      if (messages[key]) {
        return messages[key]!;
      }
    }

    if (errors['required']) {
      return `${this.label()} is required.`;
    }
    if (errors['email']) {
      return 'Enter a valid email address.';
    }
    if (errors['minlength']) {
      return `${this.label()} must be at least ${errors['minlength'].requiredLength} characters.`;
    }
    if (errors['maxlength']) {
      return `${this.label()} must be at most ${errors['maxlength'].requiredLength} characters.`;
    }
    if (errors['min']) {
      return `${this.label()} must be at least ${errors['min'].min}.`;
    }

    return `${this.label()} is invalid.`;
  });
}
