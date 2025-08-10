import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TaskService } from '../task.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { DeleteTaskDialogComponent } from '../../../shared/delete-task-dialog/delete-task-dialog.component';
import { MatDividerModule } from '@angular/material/divider';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

@Component({
  selector: 'app-task-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatButtonModule,
    MatDividerModule,
  ],
  templateUrl: './task-create.component.html',
  styleUrls: ['./task-create.component.scss'],
  animations: [
    trigger('slideToggle', [
      state('void', style({ height: '0px', opacity: 0, overflow: 'hidden' })),
      state('*', style({ height: '*', opacity: 1, overflow: 'hidden' })),
      transition('void <=> *', animate('200ms ease-in-out')),
    ]),
  ],
})
export class TaskCreateComponent implements OnInit {
  taskForm!: FormGroup;
  @Input() editMode = false;
  @Input() taskToEdit: any = null;
  @Output() taskCreated = new EventEmitter<void>();
  history: any[] = [];
  showHistory = false;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<TaskCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      label: ['', Validators.required],
      description: [''],
      due_date: ['', Validators.required],
    });

    if (this.data?.task) {
      this.editMode = true;
      this.taskToEdit = this.data.task;

      const draftKey = `task-draft-${this.taskToEdit.id}`;
      const draft = sessionStorage.getItem(draftKey);

      // Load draft if exists, else load original task
      if (draft) {
        this.taskForm.patchValue(JSON.parse(draft));
      } else {
        this.taskForm.patchValue(this.taskToEdit);
      }

      // Delay subscription so it doesn't trigger on initial patch
      setTimeout(() => {
        this.taskForm.valueChanges.subscribe((value) => {
          // Save only if there's a change compared to the task
          if (JSON.stringify(value) !== JSON.stringify(this.taskToEdit)) {
            sessionStorage.setItem(draftKey, JSON.stringify(value));
          }
        });
      }, 0);

      // Fetch history
      this.taskService.getTaskHistory(this.taskToEdit.id).subscribe({
        next: (history) => (this.history = history),
        error: (err) => console.error('Error fetching history:', err),
      });
    }
  }

  createOrEditTask() {
    if (this.taskForm.invalid) return;

    const taskData = this.taskForm.value;

    if (this.editMode && this.taskToEdit) {
      this.taskService.updateTask(this.taskToEdit.id, taskData).subscribe({
        next: () => {
          const draftKey = `task-draft-${this.taskToEdit.id}`;
          sessionStorage.removeItem(draftKey);

          if (!this.editMode) {
            this.taskForm.reset(); // Only reset for "create"
          }

          this.taskCreated.emit();
          this.snackBar.open('Task updated successfully!', 'Close', {
            duration: 3000,
            horizontalPosition: 'left',
          });
          this.dialogRef.close(true);
        },
        error: () => {
          this.snackBar.open('Task update failed.', 'Close', {
            duration: 3000,
            panelClass: 'snackbar-error',
          });
        },
      });
    } else {
      this.taskService.createTask(taskData).subscribe({
        next: () => {
          this.taskForm.reset(); // clear the form
          this.taskCreated.emit(); // notify parent to refresh list
          this.snackBar.open('Task created successfully!', 'Close', {
            duration: 3000,
          });
          this.dialogRef.close(true); // return true to refresh task list
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

  closeDialog() {
    this.dialogRef.close();
  }

  deleteTask() {
    const deleteDialogRef = this.dialog.open(DeleteTaskDialogComponent);

    deleteDialogRef.afterClosed().subscribe((result) => {
      if (result && this.taskToEdit?.id) {
        this.taskService.deleteTask(this.taskToEdit.id).subscribe({
          next: () => {
            this.snackBar.open('Task deleted successfully!', 'Close', {
              duration: 3000,
            });
            this.dialogRef.close(true); // ✅ Success!
          },
          error: () => {
            this.snackBar.open('Failed to delete task.', 'Close', {
              duration: 3000,
              panelClass: 'snackbar-error',
            });
          },
        });
      }
    });
  }
}
