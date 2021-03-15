import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DialogService} from '../../_services/dialog.service';
import {FollowerService} from '../../_services/follower.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-registration-unsubscribe',
  templateUrl: './registration-unsubscribe.component.html',
  styleUrls: ['./registration-unsubscribe.component.css']
})
export class RegistrationUnsubscribeComponent implements OnInit, OnDestroy {

  constructor(private userService: FollowerService,
              private dialogService: DialogService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  urlToken: string;
  urlEvent: string;
  visitor: any;

  userService$: Subscription;
  dialogService$: Subscription;

  unsubscribeFollower(): void {

    this.userService$ = this.userService.unsubscribe(this.urlToken, this.urlEvent).subscribe(
      data => {
        this.visitor = data.response;
        this.dialogService.openSuccessResponseDialog('Odhlásený', this.visitor.message, '/home');
      },
      error => {
        this.visitor = error.error;
        this.dialogService.openErrorResponseDialog('Error!', this.visitor.error.message, '/home');
      }
    );
  }

  ngOnInit() {

    this.urlToken = this.route.snapshot.queryParamMap.get('token');
    this.urlEvent = this.route.snapshot.queryParamMap.get('event');

    if (this.urlToken && this.urlEvent) {
      this.dialogService$ = this.dialogService.openConfirmDialog('Chceš sa odhlásiť z kurzu Ješua?')
        .afterClosed().subscribe(data => { // returns true if OK is clicked
          if (data) {
            this.unsubscribeFollower();
          } else {
            this.router.navigate(['/home']);
          }
        });
    } else {
      // not valid URL
      this.dialogService.openErrorResponseDialog('Error!', 'Not valid URL', '/home');
    }
  }

  ngOnDestroy(): void {
    if (this.userService$) {
      this.userService$.unsubscribe();
    }
  }
}
