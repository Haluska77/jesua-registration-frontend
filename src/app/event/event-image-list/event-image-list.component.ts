import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

interface Images {
  projectName: string;
  image: string;
}

@Component({
  selector: 'app-event-image-list',
  templateUrl: './event-image-list.component.html',
  styleUrls: ['./event-image-list.component.css']
})

export class EventImageListComponent {

  constructor(public dialogRef: MatDialogRef<EventImageListComponent>,
              @Inject(MAT_DIALOG_DATA) public data: string
  ) {}

  images: Images[] = [
    {projectName: 'jesua', image: 'logo_jesua.png'},
    {projectName: 'jesua', image: 'logo_jesua2.png'},
    {projectName: 'Kalvarka', image: 'logo_kalvarka.png'}
  ];

  select(image: string): void {
    this.dialogRef.close(image);
  }
}
