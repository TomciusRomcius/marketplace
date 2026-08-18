import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Item } from './items-service';

export interface Purchase {
  purchase_id: number;
  item: Item;
  created_at: string;
  updated_at: string;
}

@Injectable({
  providedIn: 'root',
})
export class PurchasesService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  getMyPurchases(): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(`${this.baseUrl}/purchases`, {
      withCredentials: true,
    });
  }

  purchaseItem(itemId: number): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/purchases`,
      { item_id: itemId },
      { withCredentials: true },
    );
  }
}
