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
    this.s3Service.getPostersAllByProject(project)
      .pipe(
        map(data => data.response.body
          .map(image => {
            console.log(image);
          })
        ),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(data => this.s3Images = data);
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
