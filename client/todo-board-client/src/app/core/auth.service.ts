import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  register(data: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/register`, data);
  }

  login(data: { username: string; password: string }): Observable<any> {
    return this.http
      .post<{ token: string }>(`${this.apiUrl}/users/login`, data)
      .pipe(
        tap((res) => {
          localStorage.setItem('token', res.token);
        }),
      );
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;
    return true;
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }
}
