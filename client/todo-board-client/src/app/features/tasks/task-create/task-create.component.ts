import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from '../task.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core'; 

@Component({
  selector: 'app-task-create',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatOptionModule
  ],
  templateUrl: './task-create.component.html',
  styleUrls: ['./task-create.component.scss'],
})
export class TaskCreateComponent implements OnInit{
  taskForm!: FormGroup;
  @Input() editMode = false;
  @Input() taskToEdit: any = null;
  @Output() taskCreated = new EventEmitter<void>();
  
  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      label: ['', Validators.required],
      description: [''],
      due_date: ['', Validators.required],
    });

    if (this.editMode && this.taskToEdit) {
      this.taskForm.patchValue(this.taskToEdit);
    }
  }

  createOrEditTask() { 
    
    if (this.taskForm.invalid) return;

    const taskData = this.taskForm.value;

    if (this.editMode && this.taskToEdit) {
      // this.taskService.updateTask(this.taskToEdit.id, taskData).subscribe({
      //   next: () => {
      //     this.snackBar.open('Task updated successfully!', 'Close', {
      //       duration: 3000,
      //       panelClass: 'snackbar-success',
      //     });
      //   },
      //   error: () => {
      //     this.snackBar.open('Task update failed.', 'Close', {
      //       duration: 3000,
      //       panelClass: 'snackbar-error',
      //     });
      //   },
      // });
    } else {
      this.taskService.createTask(taskData).subscribe({
        next: () => {
          this.snackBar.open('Task created successfully!', 'Close', {
            duration: 3000,
            panelClass: 'snackbar-success',
          });
          this.taskForm.reset(); // clear the form
          this.taskCreated.emit(); // notify parent to refresh list
        },
        error: () => {
          this.snackBar.open('Task creation failed.', 'Close', {
            duration: 3000,
            panelClass: 'snackbar-error',
          });
        },
      });
    }
  }
}
