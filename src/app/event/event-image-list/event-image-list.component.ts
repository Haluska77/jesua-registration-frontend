import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FileS3Service, Images} from '../../_services/file-s3.service';
import {map, takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-event-image-list',
  templateUrl: './event-image-list.component.html',
  styleUrls: ['./event-image-list.component.css']
})

export class EventImageListComponent implements OnInit, OnDestroy {

  constructor(
    private s3Service: FileS3Service,
    public imageListRef: MatDialogRef<EventImageListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  private ngUnsubscribe = new Subject();

  s3Images: Images[] = [];

  ngOnInit() {
    this.s3Service.getPostersByProject(this.data.project)
      .pipe(
        map(data => data.response.body
          .map(image => {
            const s3Image = this.s3Service.getS3Image(this.data.project, image.contentId);
            this.s3Images.push({imageValue: image.contentId, s3Value: s3Image});
          })
        ),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();
  }

  select(image: Images): void {
    this.imageListRef.close(image);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
