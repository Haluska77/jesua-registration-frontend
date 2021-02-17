import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DialogService} from '../_services/dialog.service';
import {VisitorService} from '../_services/visitor.service';

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

  ngOnInit() {
    this.route.queryParams.subscribe(query => {
      this.urlToken = query['token'];
      this.urlEvent = query['event'];
    })

    if (this.urlToken && this.urlEvent) {
      this.userService.unsubscribe(this.urlToken, this.urlEvent).subscribe(
        data => {
          this.visitor = data.response;
          this.dialogService.openSuccessResponseDialog('Odhlásený', this.visitor.message, '/registration');
        },
        error => {
          this.visitor = error.error;
          this.dialogService.openErrorResponseDialog('Error!', this.visitor.error.message, '/registration');
        }
      )
    } else {
      //not valid URL
      this.dialogService.openErrorResponseDialog('Error!', 'Not valid URL', '/registration');
    }
  }
}
