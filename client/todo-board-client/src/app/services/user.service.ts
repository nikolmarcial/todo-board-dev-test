import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:5000/api/users';

  constructor(private http: HttpClient) {}

  register(data: { username: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  login(data: { username: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data);
  }

  getProtected(token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get('http://localhost:5000/api/users/protected', {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      }),
      responseType: 'text'
    });  
  }
}
