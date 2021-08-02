import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Router} from '@angular/router';

@Component({
  selector: 'app-response-dialog',
  templateUrl: './response-dialog.component.html',
  styleUrls: ['./response-dialog.component.css']
})
export class ResponseDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data,
              public dialogRef: MatDialogRef<ResponseDialogComponent>,
              private router: Router) {
  }

  ngOnInit(): void {
  }

  closeDialog(navigation: string) {
    this.dialogRef.close(false);
    if (navigation != null) {
      if (navigation === '') {
        window.location.reload();
      } else {
        this.router.navigate([navigation]);
      }
    }
  }
}
