import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment.development';

export interface Item {
  id: number;
  title: string;
  description: string;
  price_cents: number;
  seller_id: number;
  created_at: string;
  updated_at: string;
  image_url?: string | null;
}

interface ItemsResponse {
  items: Item[];
}

@Injectable({
  providedIn: 'root',
})
export class ItemsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  getItems(): Observable<Item[]> {
    return this.http
      .get<ItemsResponse>(`${this.baseUrl}/items`, { withCredentials: true })
      .pipe(map((response) => response.items));
  }

  getMyItems(): Observable<Item[]> {
    return this.http
      .get<ItemsResponse>(`${this.baseUrl}/items/mine`, {
        withCredentials: true,
      })
      .pipe(map((response) => response.items));
  }

  createItem(payload: {
    title: string;
    description: string;
    price_cents: number;
  }): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(`${this.baseUrl}/items`, payload, {
      withCredentials: true,
    });
  }

  deleteItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/items/${id}`, {
      withCredentials: true,
    });
  }
}
