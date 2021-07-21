import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FileS3Service, Images} from '../../_services/file-s3.service';
import {map, takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-event-image-list',
  templateUrl: './event-image-list.component.html',
  styleUrls: ['./event-image-list.component.css']
})

export class EventImageListComponent implements OnInit, OnDestroy {

  constructor(
    private s3Service: FileS3Service,
    public imageListRef: MatDialogRef<EventImageListComponent>,
    private sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  private ngUnsubscribe = new Subject();

  image: Images;
  images: Images[] = [];

  ngOnInit() {
    this.s3Service.getPostersAllByProject(this.data.project)
      .pipe(
        map(data => data.response.body
          .map(response => {
            this.image = new Images();
            this.image.imageValue = response.contentId;
            this.image.imageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.s3Service.getImageTypeBase64(response.fileType) + response.fileData);
            this.images.push(this.image);
            return this.images;
          })),
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
