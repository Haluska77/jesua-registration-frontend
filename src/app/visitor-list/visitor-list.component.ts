import {Component, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {DatePipe} from '@angular/common';
import {FollowerService} from '../_services/follower.service';
import {DialogService} from '../_services/dialog.service';

@Component({
  selector: 'app-visitor-list',
  templateUrl: './visitor-list.component.html',
  styleUrls: ['./visitor-list.component.css'],
  providers: [DatePipe]
})
export class VisitorListComponent implements OnInit {

  constructor(private followerService: FollowerService,
    private dialogService: DialogService,
  ) { }

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  followerList: any[];
  follower: any;

  ngOnInit() {
    this.dtOptions = {
      pageLength: 10,
      stateSave: true,
      lengthMenu: [[10, 20, 50, -1], [10, 20, 50, "All"]],
      processing: true,
      order: [[3, 'asc']],
      language: { url: '//cdn.datatables.net/plug-ins/1.10.22/i18n/Slovak.json' }
    };
    this.followerService.getVisitorListByProjects().subscribe(
      data => {
        this.followerList = data.response.body;
        this.dtTrigger.next();
      });
  }

  unsubscribe(email: string, token: string, event: string) {
    this.dialogService.openConfirmDialog('Are you sure to unsubscribe user: \'' + email + '\'?')
      .afterClosed().subscribe(response => {
        if (response) {
          this.followerService.unsubscribe(token, event).subscribe(
            data => {
              this.follower = data.response;
              this.dialogService.openSuccessResponseDialog('Odhlásený', this.follower.message, '/visitors');
            },
            error => {
              this.follower = error.error.error.message;
              console.log(error.error.error.message);
            }
          );
        }
      }
      );
  }
}
