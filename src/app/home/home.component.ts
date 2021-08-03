import {Component, OnInit} from '@angular/core';
import {HomeService} from '../_services/home.service';
import {MatDialog} from '@angular/material/dialog';
import {RegistrationDialogFormComponent} from '../registration/registration-dialog-form/registration-dialog-form.component';
import {interval, Observable} from 'rxjs';
import {map, takeWhile} from 'rxjs/operators';
import {Project, ProjectService} from '../_services/project.service';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {FileS3Service} from '../_services/file-s3.service';
import {SafeUrl} from '@angular/platform-browser';

export class EventDetail {
  event: Event;
  state: string;
  availableCapacity: number;
  obsCapacity: Observable<number>;
  imageUrl: SafeUrl;
}

interface Event {
  id: number;
  description: string;
  startDate: string;
  active: number;
  waiting: number;
  capacity: number;
  image: string;
  project: any;
}

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'sk-SK'},
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ]
})
export class HomeComponent implements OnInit {

  events: EventDetail[];
  projectSearch: number;
  openSearch: boolean;
  dateFromSearch: string;
  dateToSearch: string;
  filteredCount: any = {count: 0};
  projectList$: Observable<Project[]>;

  constructor(private homeService: HomeService,
              public projectService: ProjectService,
              private s3Service: FileS3Service,
              public dialog: MatDialog) {
  }

  onCreate(course: any): void {
    this.dialog.open(RegistrationDialogFormComponent, {
      width: '400px',
      disableClose: false,
      autoFocus: true,
      panelClass: 'myapp-dialog',
      data: {course}
    });

  }

  ngOnInit(): void {
    this.projectList$ = this.projectService.getAllProjectList();

    this.homeService.getStatistics()
      .pipe(
        map(data => data.response.body
          .map(
            (item: Event) => {
              const eventDetail = new EventDetail();
              eventDetail.event = item;
              if (item.image == null) {
                eventDetail.imageUrl = this.s3Service.defaultImage;
              } else {
                this.s3Service.displayImage(item.image).subscribe(image => eventDetail.imageUrl = image);
              }

              if (item.active < item.capacity) {
                eventDetail.state = 'free';
                eventDetail.availableCapacity = item.capacity - item.active;
              } else {
                eventDetail.state = 'full';
                eventDetail.availableCapacity = item.waiting;

              }
              eventDetail.obsCapacity = interval(30)
                .pipe(
                  takeWhile(x => x <= eventDetail.availableCapacity)
                );
              return eventDetail;

            }
          )
        )
      ).subscribe(data => this.events = data);

  }

  resetFilter(): void {
    this.projectSearch = undefined;
    this.openSearch = false;
    this.dateFromSearch = undefined;
    this.dateToSearch = undefined;
  }
}
