import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../task.service';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TaskCreateComponent } from '../task-create/task-create.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ToastService } from '../../toast/toast.service';

@Component({
  selector: 'app-task-board',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './task-board.component.html',
  styleUrls: ['./task-board.component.scss'],
})
export class TaskBoardComponent implements OnInit {
  constructor(
    private taskService: TaskService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private toastService: ToastService,
  ) {}

  @Input() tasks: any[] = [];

  columns = ['To Do', 'In Progress', 'Done'];

  ngOnInit(): void {
    this.fetchTasks();
  }

  fetchTasks() {
    const isFirstLogin = !sessionStorage.getItem('shown-task-warnings');
    const shownTasks = isFirstLogin
      ? []
      : JSON.parse(sessionStorage.getItem('shown-task-warnings') || '[]');

    this.taskService.getTasks().subscribe({
      next: (data) => {
        this.tasks = data;

        this.tasks.forEach((task) => {
          const soonKey = `${task.id}-soon`;
          const overdueKey = `${task.id}-overdue`;

          if (task.isExpiringSoon && !shownTasks.includes(soonKey)) {
            this.toastService.addToast(
              `Task "${task.title}" is due soon!`,
              'warning',
            );
            shownTasks.push(soonKey);
          }

          if (task.isOverdue && !shownTasks.includes(overdueKey)) {
            this.toastService.addToast(
              `Task "${task.title}" is overdue!`,
              'error',
            );
            shownTasks.push(overdueKey);
          }
        });

        sessionStorage.setItem(
          'shown-task-warnings',
          JSON.stringify(shownTasks),
        );
      },
    });
  }

  getTasksByLabel(label: string) {
    return this.tasks.filter((task) => task.label === label);
  }

  onDragStart(event: DragEvent, taskId: number) {
    event.dataTransfer?.setData('text/plain', taskId.toString());
  }

  onDrop(event: DragEvent, newLabel: string) {
    event.preventDefault();
    const taskId = parseInt(
      event.dataTransfer?.getData('text/plain') || '0',
      10,
    );
    const task = this.tasks.find((t) => t.id === taskId);
    if (task && task.label !== newLabel) {
      task.label = newLabel;
      this.taskService.updateTask(task.id, task).subscribe(() => {
        this.fetchTasks();
      });
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
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

  getCardColor(label: string): string {
    switch (label) {
      case 'To Do':
        return '#f9b3beff'; // light red
      case 'In Progress':
        return '#ffe8c3ff'; // light orange
      case 'Done':
        return '#d0ffd4ff'; // light green
      default:
        return '#f0f0f0';
    }
  }

  openEditTaskDialog(task: any) {
    const dialogRef = this.dialog.open(TaskCreateComponent, {
      width: '400px',
      data: { task }, // pass the task object
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fetchTasks(); // refresh board
      }
    });
  }

  hasDraft(taskId: number): boolean {
    return !!sessionStorage.getItem(`task-draft-${taskId}`);
  }
}
