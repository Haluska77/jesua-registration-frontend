import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {GdprDialogComponent} from '../_dialog/gdpr-dialog/gdpr-dialog.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openGdpr(){
    this.dialog.open(GdprDialogComponent, {
      width: '400px',
      maxHeight: '600px',
      disableClose: false,
      autoFocus: true,
      panelClass: 'response-dialog-container',
      data: {}
    });

  }
}
