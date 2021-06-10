import {Component, Inject, OnInit, Optional} from '@angular/core';
import {FileS3Service} from '../../_services/file-s3.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {HttpEventType} from '@angular/common/http';
import {Subject, Subscription} from 'rxjs';
import {finalize, takeUntil} from 'rxjs/operators';
import {DialogService} from '../../_services/dialog.service';
import {SpinnerService} from '../../_services/spinner.service';

@Component({
  selector: 'app-uplod-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent implements OnInit {

  selectedFiles: FileList;
  progress: { percentage: number } = {percentage: 0};
  currentFileUpload: boolean;
  selectedFile: File;
  uploadSubscription: Subscription;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private s3Service: FileS3Service,
              private dialogRef: MatDialogRef<UploadFileComponent>,
              private dialogService: DialogService,
              private spinnerService: SpinnerService,
              @Optional()
              @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit(): void {
  }

  upload(project: number) {
    this.currentFileUpload = !!this.selectedFile;

    if (this.s3Service.isImage(this.selectedFile)) {
      if (this.s3Service.hasSmallSize(this.selectedFile)) {
        this.uploadSubscription = this.s3Service.uploadFileToBackend(project, this.selectedFile)
          .pipe(
            takeUntil(this.destroy$),
            finalize(() => {
              this.close();
            })
          )
          .subscribe((event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress.percentage = Math.round(100 * event.loaded / event.total);
            } else if (event.type === HttpEventType.Response) {
              this.dialogRef.close(false);
              this.dialogService.openSuccessResponseDialog('Úspešné', 'Obrázok bol úspešne odoslaný', null);
            }
            this.selectedFile = undefined;
            this.selectedFiles = undefined;
          });
      } else {
        this.dialogService.openErrorResponseDialog('Error', 'Obrázok \'' + this.selectedFile.name + '\' ' +
          'má veľkosť ' + Math.ceil(this.selectedFile.size / 1024) +
          'kB. <br> Nesmie byť väčší ako ' + this.s3Service.fileSizeLimit + 'kB', null);
      }
    } else {
      this.dialogService.openErrorResponseDialog('Error', 'Vyberte obrázok', null);
    }
  }

  cancelFileUpload(): void {
    if (this.uploadSubscription) {
      this.uploadSubscription.unsubscribe();
    }
    this.close();
  }

  close() {
    this.spinnerService.hide();
    this.dialogRef.close(false);
  }

  selectFile(event) {
    this.selectedFiles = event.target.files;
    this.selectedFile = this.selectedFiles.item(0);

  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
