import {
  Component,
  ElementRef,
  OnDestroy,
  input,
  model,
  signal,
  viewChild,
} from '@angular/core';
import { Button } from '../../button/button';

interface Preview {
  file: File;
  url: string;
}

@Component({
  selector: 'app-image-upload',
  imports: [Button],
  template: `
    <div class="flex flex-wrap items-start gap-3">
      <div
        class="flex h-36 w-36 flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-3"
      >
        <p class="text-center text-sm font-medium text-slate-600">
          Upload image
        </p>
        <div class="w-full">
          <app-button
            type="regular"
            htmlType="button"
            [disabled]="disabled()"
            (click)="openFilePicker()"
          >
            Choose files
          </app-button>
        </div>
        <input
          #fileInput
          type="file"
          accept="image/*"
          multiple
          class="hidden"
          (change)="onFilesSelected($event)"
        />
      </div>

      @for (preview of previews(); track preview.url) {
        <div
          class="relative h-36 w-36 overflow-hidden rounded-lg border border-slate-200 bg-white"
        >
          <img
            [src]="preview.url"
            [alt]="preview.file.name"
            class="h-full w-full object-cover"
          />
        </div>
      }
    </div>
  `,
})
export class ImageUpload implements OnDestroy {
  readonly files = model<File[]>([]);
  readonly disabled = input(false);

  private readonly fileInput =
    viewChild<ElementRef<HTMLInputElement>>('fileInput');

  readonly previews = signal<Preview[]>([]);

  ngOnDestroy(): void {
    this.revokeObjectUrls(this.previews());
  }

  openFilePicker(): void {
    if (this.disabled()) {
      return;
    }
    this.fileInput()?.nativeElement.click();
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const selected = input.files ? Array.from(input.files) : [];
    if (selected.length === 0) {
      return;
    }

    const nextFiles = [...this.files(), ...selected];
    this.files.set(nextFiles);
    this.revokeObjectUrls(this.previews());
    this.previews.set(
      nextFiles.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      })),
    );
    input.value = '';
  }

  private revokeObjectUrls(previews: Preview[]): void {
    for (const preview of previews) {
      URL.revokeObjectURL(preview.url);
    }
  }
}
