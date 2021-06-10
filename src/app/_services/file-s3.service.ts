import {Injectable} from '@angular/core';
import * as AWS from 'aws-sdk';
import {HttpClient, HttpEvent} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';

export interface Images {
  imageValue: string;
  s3Value: string;
}

@Injectable({
  providedIn: 'root'
})

export class FileS3Service {

  constructor(private http: HttpClient) {
  }

  private baseUrl = environment.baseUrl + 'file/';
  defaultImage = '../assets/projects/images/no-image.png';

  enabledMimeTypes: string[] = [
    'image/png', 'image/bmp', 'image/jpg', 'image/jpeg'
  ];

  fileSizeLimit = 1024;

  s3 = new AWS.S3({
    accessKeyId: 'jesua',
    secretAccessKey: 'jesua123',
    region: 'eu-west-3'
  });

  getS3Image(project: number, content: string): string {
    const paramList = {
      Bucket: 'jesua',
      Key: project + '/' + content
    };

    if (content == null) {
      return this.defaultImage;
    }

    return this.s3.getSignedUrl('getObject', paramList);
  }

  getPostersByProject(projectId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}` + '?projectId=' + projectId);
  }

  isImage(file: File): boolean {
    return this.enabledMimeTypes.includes(file.type);
  }

  hasSmallSize(file: File): boolean {
    return file.size / 1024 < this.fileSizeLimit;
  }

  uploadFileToBackend(projectId: number, file: File): Observable<HttpEvent<any>> {

    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.baseUrl}` + 'upload?projectId=' + projectId, formData,
      {
        reportProgress: true,
        observe: 'events',
      });
  }
}
