import {Component, OnInit} from '@angular/core';
import {HomeService} from '../_services/home.service';
import {MatDialog} from '@angular/material/dialog';
import {RegistrationDialogFormComponent} from '../registration-dialog-form/registration-dialog-form.component';

export class CourseState {

  state: string;
  statusText: string;
  capacity: number;
}

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  stats: any[];

  courseState: CourseState;
  courseStateMap: Map<number, CourseState>;

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
    this.homeService.getStatistics().subscribe(
      data => {

        this.stats = data.response.body;
        this.courseStateMap = new Map<number, CourseState>();
        data.response.body.forEach(item => {
          this.courseState = new CourseState();

          if (item.active < item.capacity){
            this.courseState.state = 'free';
            this.courseState.statusText = 'Voľné';
            this.courseState.capacity = item.capacity - item.active;
          } else {
            this.courseState.state = 'full';
            this.courseState.statusText = 'Obsadené';
            this.courseState.capacity = item.waiting;
          }
          this.courseStateMap.set(item.id, this.courseState);

          // console.log('RESPONSE: ' + item.id + '-' + JSON.stringify(this.courseStateMap.get(item.id)));

          }
        );

        });
      }
}
