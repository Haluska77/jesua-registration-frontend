import {Component, OnDestroy, OnInit} from '@angular/core';
import {map, takeUntil} from 'rxjs/operators';
import {FileS3Service, Poster, PosterToDisplay} from '../../_services/file-s3.service';
import {Subject} from 'rxjs';
import {MatTableDataSource} from '@angular/material/table';
import {DomSanitizer} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import {DialogService} from '../../_services/dialog.service';
import {DialogComponentService} from '../../_services/dialog-component.service';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.css']
})
export class FileListComponent implements OnInit, OnDestroy {

  constructor(private s3Service: FileS3Service,
              private sanitizer: DomSanitizer,
              private dialogService: DialogService,
              private dialogComponentService: DialogComponentService,
              private route: ActivatedRoute) {
  }

  ngUnsubscribe$ = new Subject();
  displayedColumns: string[] = ['fileName', 'fileType', 'created', 'blob', 'action'];
  dataSource = new MatTableDataSource<PosterToDisplay>();
  currentProject: number;

  ngOnInit(): void {
    this.route.params.subscribe(param => this.currentProject = param.projectId);

    this.s3Service.getPostersAllByProject(this.currentProject)
      .pipe(
        map(data => data.response.body
          .map((response: Poster) => {
            const posterToDisplay = new PosterToDisplay();
            posterToDisplay.fileName = response.fileName;
            posterToDisplay.fileType = response.fileType;
            posterToDisplay.created = response.created;
            posterToDisplay.fileData = this.sanitizer.bypassSecurityTrustResourceUrl(this.s3Service.getImageTypeBase64(response.fileType) + response.fileData);
            posterToDisplay.keyName = response.contentId;
            return posterToDisplay;
          })
        ),
        takeUntil(this.ngUnsubscribe$))
      .subscribe(data => this.dataSource.data = data);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  deleteFile(keyName: string): void {
    // TODO add confirmation dialog YES/NO
    this.s3Service.deleteFile(keyName).subscribe(data => {
      this.dialogService.openWideSuccessResponseDialog('Zmazaný', data.response.message, '');
    });
  }

  onAddImage(project: number): void {
    this.dialogComponentService.openUploadFileComponent(project);
  }
}
