import {Component, OnDestroy} from '@angular/core';
import {map, takeUntil} from 'rxjs/operators';
import {FileS3Service, Images} from '../../_services/file-s3.service';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.css']
})
export class FileListComponent implements OnDestroy {

  constructor(
    private s3Service: FileS3Service
  ) {
  }

  private ngUnsubscribe = new Subject();
  s3Images: Images[] = [];

  showFilesByProject(project: number): void {
    this.s3Service.getPostersByProject(project)
      .pipe(
        map(data => data.response.body
          .map(image => {
            const s3Image = this.s3Service.getS3Image(project, image.contentId);
            this.s3Images.push({imageValue: image.contentId, s3Value: s3Image});
          })
        ),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  preview(s3image: Images) {

  }

  deleteFile(s3image: Images) {

  }
}
