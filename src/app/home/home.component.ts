import {Component, OnInit} from '@angular/core';
import {HomeService} from '../_services/home.service';
import {interval, Subscription} from 'rxjs';

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

  constructor(private homeService: HomeService) {
  }

  courseState: CourseState;
  courseStateMap: Map<number, CourseState>;
  stats: any;
  myGreenSubscriptionMap: Map<number, Subscription>;
  myRedSubscriptionMap: Map<number, Subscription>;

  myGreenSubscription: Subscription;
  myRedSubscription: Subscription;

  countGreen: Map<number, number>;
  countRed: Map<number, number>;
  incrementTotalMap: Map<number, number>;
  incrementTotal: number;
  incrementRun: Map<number, number>;

  ngOnInit(): void {

    this.homeService.getStatistics().subscribe(
      data => {

        this.stats = data.response.body;

        this.courseStateMap = new Map<number, CourseState>();
        this.myGreenSubscriptionMap = new Map<number, Subscription>();
        this.myRedSubscriptionMap = new Map<number, Subscription>();
        this.countGreen = new Map<number, number>();
        this.countRed = new Map<number, number>();
        this.incrementTotalMap = new Map<number, number>();
        this.incrementRun = new Map<number, number>();

        data.response.body.forEach(item => {
            this.myGreenSubscription = new Subscription();
            this.myRedSubscription = new Subscription();
            this.myGreenSubscriptionMap.set(item.id, this.myGreenSubscription);
            this.myRedSubscriptionMap.set(item.id, this.myRedSubscription);
            this.incrementRun.set(item.id, 0);


            this.courseState = new CourseState();
            this.incrementTotal = 0;
            this.myGreenSubscriptionMap.set(item.id, interval(30).subscribe(x => {

              if (x <= item.active) {
                if (x > 0) {

                  this.countGreen.set(item.id, x);
                  this.incrementTotalMap.set(item.id, this.countGreen.get(item.id));
                }
                // console.log(item.id + ' Green: current/active/Total ' + x + '/' + item.active + '/' + this.incrementTotalMap.get(item.id));
              } else {
                this.myGreenSubscriptionMap.get(item.id).unsubscribe();
                this.myRedSubscriptionMap.set(item.id, interval(30).subscribe(y => {
                  if (y <= item.waiting) {
                    if (y > 0) {
                      this.incrementTotalMap.set(item.id, this.incrementTotal++);
                      this.countRed.set(item.id, y);
                      this.incrementTotalMap.set(item.id, this.countGreen.get(item.id) + this.countRed.get(item.id));
                    }
                    // console.log(item.id + ' Red: current/waiting/Total ' + y + '/' + item.waiting + '/' + this.incrementTotalMap.get(item.id));
                  } else {
                    this.myRedSubscriptionMap.get(item.id).unsubscribe();
                  }
                }));
              }
            }));


            if (item.active < item.capacity) {
              this.courseState.state = 'free';
              this.courseState.statusText = 'Voľné';
              this.courseState.capacity = item.capacity - item.active;
            } else {
              this.courseState.state = 'full';
              this.courseState.statusText = 'Obsadené';
              this.courseState.capacity = item.waiting;
            }
            this.courseStateMap.set(item.id, this.courseState);

            console.log('RESPONSE: ' + item.id + '-' + JSON.stringify(this.courseStateMap.get(item.id)));

          }
        );
      }
    );
  }
}
