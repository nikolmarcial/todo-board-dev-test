import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastMessage {
  id: number;
  text: string;
  type: 'warning' | 'error';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toasts: ToastMessage[] = [];
  private toasts$ = new BehaviorSubject<ToastMessage[]>([]);

  get toastStream() {
    return this.toasts$.asObservable();
  }

  addToast(text: string, type: 'warning' | 'error') {
    const id = Date.now() + Math.random();
    this.toasts.push({ id, text, type });
    this.toasts$.next([...this.toasts]);
  }

  removeToast(id: number) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.toasts$.next([...this.toasts]);
  }

  clearToasts() {
    this.toasts = [];
    this.toasts$.next([]);
  }
}
