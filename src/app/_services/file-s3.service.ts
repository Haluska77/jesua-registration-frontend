import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {map} from 'rxjs/operators';

export class Images {
  imageValue: string;
  imageUrl: SafeUrl;
}

@Injectable({
  providedIn: 'root'
})

export class FileS3Service {

  constructor(private http: HttpClient,
              private sanitizer: DomSanitizer) {
  }

  private baseUrl = environment.baseUrl + 'poster/';
  defaultImage = '../assets/projects/images/no-image.png';

  enabledMimeTypes: string[] = [
    'image/png', 'image/jpg', 'image/jpeg'
  ];

  fileSizeLimit = 1024;
  image: any;
  imageType = 'image/PNG';

  getImageTypeBase64(fileType: string): string {
    return 'data:' + fileType + ';base64,';
  }

  displayImage(image: string): Observable<any> {

    return this.http.get(`${this.baseUrl}` + image)
      .pipe(map((data: any) => {
          return this.sanitizer.bypassSecurityTrustUrl(this.getImageTypeBase64(this.imageType) + data.response.body);
        })
      );
  }

  getPostersAllByProject(projectId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}` + 'all?projectId=' + projectId);
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
