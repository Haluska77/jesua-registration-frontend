import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../_services/dialog.service';
import { VisitorService } from '../_services/visitor.service';

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
  visitors: any;

  ngOnInit() {
    // this.queries = this.route.snapshot.queryParamMap;
    this.route.queryParams.subscribe(query => {
      this.urlToken = query['token'];
      this.urlEvent = query['event'];
    })

    if (this.urlToken && this.urlEvent) {
      this.userService.unsubscribe(this.urlToken, this.urlEvent).subscribe(
        data => {
          this.visitors = data;
          this.dialogService.openResponseDialog('check_circle_outline', 'Odhlásený', this.visitors.message, '/registration');
        },
        error => {
          this.visitors = error;
          this.dialogService.openResponseDialog('highlight_off', 'Error!', this.visitors.error.message, '/registration');
        }
      )
    } else {
      //not valid URL
      this.dialogService.openResponseDialog('highlight_off', 'Error!', 'Not valid URL', '/registration');
    }
  }
}
