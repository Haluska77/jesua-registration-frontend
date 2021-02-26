import {Component, OnInit} from '@angular/core';
import {HomeService} from '../_services/home.service';

export class Follower {

  name: string;
  value: number;
}

export class FollowerStat {

  name: string;
  series: Follower[];
}

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
  xAxisTicks: any[] = [0, 3];
  view: any[] = [600, 150];
  showXAxis = true;
  showLegend = true;
  showXAxisLabel = true;

  colorScheme = {
    domain: ['#55834d', '#aa3333']
  };

  followerActive: Follower;
  followerWaiting: Follower;
  followerArray: Follower[];
  followerStat: FollowerStat;
  finalStats: FollowerStat[];
  finalStatsList: Map<number, FollowerStat[]>;
  courseState: CourseState;
  courseStateMap: Map<number, CourseState>;

  constructor(private homeService: HomeService) {
    Object.assign(this, this.finalStats);
  }

  ngOnInit(): void {
    this.homeService.getStatistics().subscribe(
      data => {

        this.stats = data.response.body;
        this.courseStateMap = new Map<number, CourseState>();
        data.response.body.forEach(item => {
          this.courseState = new CourseState();

          if (item.active === 3 && item.waiting > 0){
            this.courseState.state = 'full';
            this.courseState.statusText = 'Obsadené';
            this.courseState.capacity = item.waiting;
          } else {
            this.courseState.state = 'free';
            this.courseState.statusText = 'Voľné';
            this.courseState.capacity = 3 - item.active;
          }
          this.courseStateMap.set(item.id, this.courseState);

          // console.log('RESPONSE: ' + item.id + '-' + JSON.stringify(this.courseStateMap.get(item.id)));

          }
        );
        // this.finalStatsList = new Map<number, FollowerStat[]>();
        // this.courseState = new Map<number, string>();
        // data.response.body.forEach(item => {
        //   this.courseState.set(item.course.id, item.statFollowers.false > 0 ? 'Obsadene' : 'Volne');
        //
        //   this.followerArray = [];
        //   this.followerActive = new Follower();
        //   this.followerActive.name = 'Prihlaseny';
        //   this.followerActive.value = item.statFollowers.true;
        //   this.followerArray.push(this.followerActive);
        //
        //   this.followerWaiting = new Follower();
        //   this.followerWaiting.name = 'V poradi';
        //   this.followerWaiting.value = item.statFollowers.false;
        //   this.followerArray.push(this.followerWaiting);
        //
        //   this.followerStat = new FollowerStat();
        //   this.followerStat.name = item.course.description + '(' + item.course.startDate + ')';
        //   this.followerStat.series = this.followerArray;
        //   this.finalStats = [];
        //   this.finalStats.push(this.followerStat);
        //   this.finalStatsList.set(item.course.id, this.finalStats);
        });
      }
  //   );
  // }

}
