import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { DeleteTaskDialogComponent } from '../delete-task-dialog/delete-task-dialog.component';

@Component({
  selector: 'app-logout-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Confirm Logout</h2>
    <mat-dialog-content>Are you sure you want to logout?</mat-dialog-content>
    <mat-dialog-actions align="end" style="gap: .5rem">
      <button mat-button (click)="dialogRef.close(false)">Cancel</button>
      <button mat-raised-button color="warn" (click)="dialogRef.close(true)">
        Logout
      </button>
    </mat-dialog-actions>
  `,
})
export class LogoutDialogComponent {
  constructor(public dialogRef: MatDialogRef<LogoutDialogComponent>) {}
}
