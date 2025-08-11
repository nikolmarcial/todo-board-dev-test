import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-first-time-guide',
  imports: [MatDialogModule],
  templateUrl: './first-time-guide.component.html',
  styleUrl: './first-time-guide.component.scss'
})
export class FirstTimeGuideComponent {
  constructor(private dialogRef: MatDialogRef<FirstTimeGuideComponent>) {}

  closeGuide() {
    this.dialogRef.close();
  }
}
