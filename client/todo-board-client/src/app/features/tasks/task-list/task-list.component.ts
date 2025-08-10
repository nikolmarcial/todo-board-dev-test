import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { TaskService } from '../task.service';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-task-list',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule,
    MatListModule,
    MatDialogContent,
    MatDialogActions,
  ],
  template: `
    <h2 mat-dialog-title>Tasks Due for Today</h2>
    <mat-dialog-content>
      <div *ngIf="loading">Loading...</div>
      <div *ngIf="tasks.length === 0 && !loading">No tasks due today.</div>
      <mat-list>
        <mat-list-item *ngFor="let task of tasks">
          <strong [style.color]="getStatusColor(task.label)">
            {{ task.label }}
          </strong>
          &nbsp;– {{ task.title }}
        </mat-list-item>
      </mat-list>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="close()">Close</button>
    </mat-dialog-actions>
  `,
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent {
  tasks: any[] = [];
  loading = true;

  constructor(
    private taskService: TaskService,
    private dialogRef: MatDialogRef<TaskListComponent>,
  ) {}

  ngOnInit(): void {
    this.taskService.getTasks().subscribe({
      next: (data) => {
        const today = new Date().toDateString();
        this.tasks = data.filter(
          (t) => new Date(t.due_date).toDateString() === today,
        );
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  getStatusColor(label: string): string {
    switch (label) {
      case 'To Do':
        return '#f44336';
      case 'In Progress':
        return '#ff9800';
      case 'Done':
        return '#4caf50';
      default:
        return '#9e9e9e';
    }
  }

  close() {
    this.dialogRef.close();
  }
}
