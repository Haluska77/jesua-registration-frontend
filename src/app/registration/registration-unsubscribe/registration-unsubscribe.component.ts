import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DialogService} from '../../_services/dialog.service';
import {FollowerService} from '../../_services/follower.service';
import {Subscription} from 'rxjs';
import {map} from 'rxjs/operators';

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
  course: any;

  userService$: Subscription;
  dialogService$: Subscription;

  unsubscribeFollower(token: string, event: string): void {

    this.userService$ = this.userService.unsubscribe(token, event).subscribe(
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

    if (this.urlToken) {
      this.userService$ = this.userService.getVisitorListByToken(this.urlToken)
        .pipe(
          map((data: any) => data.response.body
            .map((body: any) => {
              this.course = body.course;
            })
          )
        )
        .subscribe((item: any) => {
          if (item.length > 0) {
            this.dialogService.openConfirmDialog('Chceš sa odhlásiť z akcie ' + this.course.description + '?')
              .afterClosed().subscribe(response => { // returns true if OK is clicked
              if (response) {
                this.unsubscribeFollower(this.urlToken, this.course.id);
              } else {
                this.router.navigate(['/home']);
              }
            });
          } else {
            this.dialogService.openErrorResponseDialog('Error!', 'Token je neplatný !!!', '/home');
          }
        });
    } else {
      this.dialogService.openErrorResponseDialog('Error!', 'Neplatná URL !!!', '/home');
    }
  }

  ngOnDestroy(): void {
    if (this.userService$) {
      this.userService$.unsubscribe();
    }
  }
}
