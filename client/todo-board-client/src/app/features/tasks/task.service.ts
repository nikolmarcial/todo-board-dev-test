import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../core/auth.service';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private apiUrl = 'http://localhost:5000/api/tasks';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  getTasks(): Observable<any[]> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<any[]>(this.apiUrl, { headers });
  }

  createTask(taskData: any) {
    const headers = this.authService.getAuthHeaders();
    return this.http.post(`${this.apiUrl}`, taskData, { headers });
  }

  updateTask(id: number, task: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, task, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  deleteTask(taskId: number) {
    return this.http.delete(`${this.apiUrl}/${taskId}`, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  getTasksByLabel(label: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?label=${label}`, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  getTaskHistory(taskId: number) {
    return this.http.get<any[]>(`${this.apiUrl}/${taskId}/history`, {
      headers: this.authService.getAuthHeaders(),
    });
  }
}
