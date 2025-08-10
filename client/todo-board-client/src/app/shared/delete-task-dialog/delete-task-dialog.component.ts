import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-task-dialog',
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  standalone: true,
  template: `<h2 mat-dialog-title>Confirm Delete</h2>
    <mat-dialog-content
      >Are you sure you want to delete this task?</mat-dialog-content
    >
    <mat-dialog-actions align="end" style="gap: .5rem">
      <button mat-button (click)="dialogRef.close(false)">No</button>
      <button mat-raised-button color="warn" (click)="dialogRef.close(true)">
        Yes
      </button>
    </mat-dialog-actions>`,
})
export class DeleteTaskDialogComponent {
  constructor(public dialogRef: MatDialogRef<DeleteTaskDialogComponent>) {}
}
