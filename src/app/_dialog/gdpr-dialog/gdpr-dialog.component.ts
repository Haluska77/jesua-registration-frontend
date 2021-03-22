import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Router} from '@angular/router';

@Component({
  selector: 'app-gdpr-dialog',
  templateUrl: './gdpr-dialog.component.html',
  styleUrls: ['./gdpr-dialog.component.css']
})
export class GdprDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data,
              public dialogRef: MatDialogRef<GdprDialogComponent>,
              private router: Router) {}

  ngOnInit(): void {
  }

  closeDialog(navigation: string) {
    this.dialogRef.close(false);
    this.router.navigate([navigation]);
  }
}
