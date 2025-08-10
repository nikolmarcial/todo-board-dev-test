import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastMessage } from './toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div *ngFor="let toast of toasts" class="toast" [ngClass]="toast.type">
        <span>{{ toast.text }}</span>
        <button (click)="closeToast(toast.id)">×</button>
      </div>
    </div>
  `,
  styleUrls: ['./toast.component.scss'],
})
export class ToastContainerComponent implements OnInit {
  toasts: ToastMessage[] = [];

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.toastService.toastStream.subscribe((toasts) => {
      this.toasts = toasts;
    });
  }

  closeToast(id: number) {
    this.toastService.removeToast(id);
  }
}
