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
  templateUrl: './image-upload.html',
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
