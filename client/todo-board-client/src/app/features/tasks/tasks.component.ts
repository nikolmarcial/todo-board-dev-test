import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TaskCreateComponent } from './task-create/task-create.component';
import { TaskListComponent } from './task-list/task-list.component';
import { Router } from '@angular/router';
import { MatToolbar } from '@angular/material/toolbar';
import { TaskService } from './task.service';

@Component({
  selector: 'app-tasks',
  imports: [
    CommonModule,
    TaskCreateComponent,
    TaskListComponent,
    MatToolbar
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent implements OnInit {
  tasks: any[] = [];

  constructor(private router: Router, private taskService: TaskService) {}
  
    ngOnInit() {
      this.loadTasks();
    }

    logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  loadTasks() {
    this.taskService.getTasks().subscribe({
      next: (data) => (this.tasks = data),
      error: (err) => console.error('Task Fetch Failed:', err),
    });
  }

}
