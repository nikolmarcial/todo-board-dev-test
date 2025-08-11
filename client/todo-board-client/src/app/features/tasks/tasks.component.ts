import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TaskCreateComponent } from './task-create/task-create.component';
import { TaskListComponent } from './task-list/task-list.component';
import { Router } from '@angular/router';
import { MatToolbar } from '@angular/material/toolbar';
import { TaskService } from './task.service';
import { TaskBoardComponent } from './task-board/task-board.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LogoutDialogComponent } from '../../shared/logout-dialog/logout-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import {
  MatDatepicker,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { ToastService } from '../toast/toast.service';
import { FirstTimeGuideComponent } from '../users/login/first-time-guide/first-time-guide.component';

@Component({
  selector: 'app-tasks',
  imports: [
    CommonModule,
    TaskBoardComponent,
    MatToolbar,
    MatDialogModule,
    MatIconModule,
    MatNativeDateModule,
    FirstTimeGuideComponent
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
})
export class TasksComponent implements OnInit {
  tasks: any[] = [];
  username = '';

  constructor(
    private router: Router,
    private taskService: TaskService,
    private dialog: MatDialog,
    private toastService: ToastService,
  ) {}

  ngOnInit() {
    this.loadTasks();
    this.loadUsername();

     if (!localStorage.getItem('hasSeenGuide')) {
    this.dialog.open(FirstTimeGuideComponent, {
      width: '500px'
    }).afterClosed().subscribe(() => {
      localStorage.setItem('hasSeenGuide', 'true');
    });
  }
  }

  loadTasks() {
    this.taskService.getTasks().subscribe({
      next: (data) => (this.tasks = data),
      error: (err) => console.error('Task Fetch Failed:', err),
    });
  }

  loadUsername() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.username = payload.username;
      } catch (e) {
        console.error('Failed to decode token:', e);
      }
    }
  }

  openLogoutDialog() {
    const dialogRef = this.dialog.open(LogoutDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.toastService.clearToasts(); // close all custom toasts
        sessionStorage.removeItem('shown-task-warnings');
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      }
    });
  }

  openTaskDialog() {
    const dialogRef = this.dialog.open(TaskCreateComponent, {
      width: '500px',
      panelClass: 'transparent-dialog-backdrop',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadTasks(); // Refresh task board
      }
    });
  }

  openTodayTasks() {
    this.dialog.open(TaskListComponent, {
      width: '500px',
      maxHeight: '80vh',
    });
  }
}
