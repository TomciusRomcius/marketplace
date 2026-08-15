import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  signIn(email: string, password: string): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/session`,
      { email_address: email, password },
      { withCredentials: true },
    );
  }
}
