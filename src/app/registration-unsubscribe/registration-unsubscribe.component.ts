import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DialogService} from '../_services/dialog.service';
import {VisitorService} from '../_services/visitor.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-registration-unsubscribe',
  templateUrl: './registration-unsubscribe.component.html',
  styleUrls: ['./registration-unsubscribe.component.css']
})
export class RegistrationUnsubscribeComponent implements OnInit {

  constructor(private userService: VisitorService,
              private dialogService: DialogService,
              private route: ActivatedRoute) { }

  urlToken: string;
  urlEvent: string;
  visitor: any;

  userService$: Subscription;

  ngOnInit() {

      this.urlToken = this.route.snapshot.queryParamMap.get('token');
      this.urlEvent = this.route.snapshot.queryParamMap.get('event');

    if (this.urlToken && this.urlEvent) {
      this.userService$ = this.userService.unsubscribe(this.urlToken, this.urlEvent).subscribe(
        data => {
          this.visitor = data.response;
          this.dialogService.openSuccessResponseDialog('Odhlásený', this.visitor.message, '/registration');
        },
        error => {
          this.visitor = error.error;
          this.dialogService.openErrorResponseDialog('Error!', this.visitor.error.message, '/registration');
        }
      );
    } else {
      // not valid URL
      this.dialogService.openErrorResponseDialog('Error!', 'Not valid URL', '/registration');
    }
  }

  ngOnDestroy() {
    this.userService$.unsubscribe();
  }
}
