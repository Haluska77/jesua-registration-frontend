import {Component, OnInit} from '@angular/core';
import {HomeService} from '../_services/home.service';
import {MatDialog} from '@angular/material/dialog';
import {RegistrationDialogFormComponent} from '../registration/registration-dialog-form/registration-dialog-form.component';
import {interval, Observable} from 'rxjs';
import {map, takeWhile} from 'rxjs/operators';

export class EventDetail {

  id: number;
  state: string;
  description: string;
  startDate: string;
  active: number;
  waiting: number;
  capacity: number;
  availableCapacity: number;
  obsCapacity: Observable<number>;
}

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  events$: Observable<EventDetail[]>;

  constructor(private homeService: HomeService,
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

    this.events$ = this.homeService.getStatistics()
      .pipe(
        map(data => data.response.body
          .map(
            item => {
              const eventDetail = new EventDetail();
              eventDetail.id = item.id;
              eventDetail.description = item.description;
              eventDetail.startDate = item.startDate;
              eventDetail.active = item.active;
              eventDetail.waiting = item.waiting;
              eventDetail.capacity = item.capacity;
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
      );

  }
}
