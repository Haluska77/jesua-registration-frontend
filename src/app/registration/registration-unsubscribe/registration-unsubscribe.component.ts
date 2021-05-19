import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DialogService} from '../../_services/dialog.service';
import {FollowerService} from '../../_services/follower.service';
import {Subscription} from 'rxjs';
import {map} from 'rxjs/operators';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-registration-unsubscribe',
  templateUrl: './registration-unsubscribe.component.html',
  styleUrls: ['./registration-unsubscribe.component.css']
})
export class RegistrationUnsubscribeComponent implements OnInit, OnDestroy {

  constructor(private userService: FollowerService,
              private dialogService: DialogService,
              private datePipe: DatePipe,
              private route: ActivatedRoute,
              private router: Router) {
  }

  urlToken: string;
  visitor: any;
  userService$: Subscription;

  unsubscribeFollower(token: string, event: string): void {

    this.userService$ = this.userService.unsubscribe(token, event)
      .subscribe(data => {
        this.visitor = data.response;
        this.dialogService.openSuccessResponseDialog('Odhlásený', this.visitor.message, '/home');
      },
      error => {
        this.dialogService.openErrorResponseDialog('Error!', error.error.error.message, '/home');
      }
    );
  }

  ngOnInit() {

    this.urlToken = this.route.snapshot.queryParamMap.get('token');

    if (this.urlToken) {
      this.userService.getVisitorByToken(this.urlToken)
        .pipe(
          map((data: any) => data.response.body
          )
        )
        .subscribe((item: any) => {
            if (item.unregistered != null) {
              const unregisteredDate = this.datePipe.transform(item.unregistered, 'dd.MM.yyyy HH:mm:ss', 'Europe/Bratislava');
              this.dialogService.openErrorResponseDialog('Odhlásený', 'Už si bol odhlásený ' + unregisteredDate, '/home');
            } else {
              this.dialogService.openConfirmDialog('Chceš sa odhlásiť z akcie ' + item.course.description + '?')
                .afterClosed().subscribe(response => { // returns true if OK is clicked
                if (response) {
                  this.unsubscribeFollower(this.urlToken, item.course.id);
                } else {
                  this.router.navigate(['/home']);
                }
              });
            }
          },
          error => {
            this.dialogService.openErrorResponseDialog('Error!', error.error.error.message, '/home');
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
