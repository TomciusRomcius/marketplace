import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ItemPhotosService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  uploadPhotos(itemId: number, files: File[]): Observable<void> {
    const formData = new FormData();
    formData.append('item_id', String(itemId));
    for (const file of files) {
      formData.append('photos', file);
    }

    return this.http.post<void>(`${this.baseUrl}/item_photos`, formData, {
      withCredentials: true,
    });
  }
}
