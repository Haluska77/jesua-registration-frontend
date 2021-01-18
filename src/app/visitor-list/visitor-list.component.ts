import { Component, OnInit } from '@angular/core';
import { Event } from '../_models/event';
import { Subject } from "rxjs";
import { DatePipe } from '@angular/common';
import { VisitorService } from '../_services/visitor.service';

@Component({
  selector: 'app-visitor-list',
  templateUrl: './visitor-list.component.html',
  styleUrls: ['./visitor-list.component.css'],
  providers: [DatePipe]
})
export class VisitorListComponent implements OnInit {

  constructor(private visitorservice: VisitorService) { }

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();


  visitors: any[];
  event: Event = new Event();
  isUnregistered = false;


  ngOnInit() {
    this.dtOptions = {
      pageLength: 10,
      stateSave: true,
      lengthMenu: [[10, 20, 50, -1], [10, 20, 50, "All"]],
      processing: true,
      order: [[3, 'asc']],
      language:{url: '//cdn.datatables.net/plug-ins/1.10.22/i18n/Slovak.json'}
    };
    this.visitorservice.getVisitorList().subscribe(
      data => {
        this.visitors = data;
        this.dtTrigger.next();
      })
  }

  exit() {
    window.location.reload();
  }

  unsubscribe(email: string, token: string, event: string) {
    //get event from DB
    this.visitorservice.unsubscribe(token, event).subscribe(
      data => {
        this.visitors = data;
        this.isUnregistered = true;
      }),
      error => console.log(error);
  }

}
