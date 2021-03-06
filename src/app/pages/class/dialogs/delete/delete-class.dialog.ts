import {Component, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-delete-class.dialog',
  templateUrl: './delete-class.dialog.html',
  styleUrls: ['./delete-class.dialog.scss'],
})

export class DeleteClassDialogComponent {
  constructor(public dialogRef: MatDialogRef<DeleteClassDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }
  onNoClick(): void {
    this.dialogRef.close();
  }
  confirmDelete(): void {}
}
