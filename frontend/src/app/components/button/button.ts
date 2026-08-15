import { Component, computed, input } from '@angular/core';

export type ButtonType = 'accent' | 'regular' | 'grayed' | 'delete';

const BASE_CLASSES =
  'w-full rounded-lg px-4 py-2.5 font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60';

const TYPE_CLASSES: Record<ButtonType, string> = {
  accent:
    'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
  regular:
    'border border-slate-300 bg-white text-slate-900 hover:bg-slate-50 focus:ring-slate-400',
  grayed:
    'bg-slate-200 text-slate-700 hover:bg-slate-300 focus:ring-slate-400',
  delete:
    'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
};

@Component({
  selector: 'app-button',
  templateUrl: './button.html',
})
export class Button {
  readonly type = input<ButtonType>('accent');
  readonly htmlType = input<'button' | 'submit' | 'reset'>('button');
  readonly disabled = input(false);

  readonly classes = computed(
    () => `${BASE_CLASSES} ${TYPE_CLASSES[this.type()]}`,
  );
}
