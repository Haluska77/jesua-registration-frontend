import { Component, OnInit } from '@angular/core';
import { Subject } from "rxjs";
import { LoginService } from '../_services/login.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  constructor(private loginService: LoginService) { }

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  users: any[];
  isChanged = false;

  ngOnInit() {
    this.dtOptions = {
      pageLength: 10,
      stateSave: true,
      lengthMenu: [[10, 20, 50, -1], [10, 20, 50, "All"]],
      processing: true,
      order: [[0, 'asc']],
      language:{url: '//cdn.datatables.net/plug-ins/1.10.22/i18n/Slovak.json'}
    };
    this.loginService.getUsers().subscribe(
      data => {
        this.users = data;
        this.dtTrigger.next();
      })
  }

  exit() {
    window.location.reload();
  }

  makeActive(id: number) {
    this.loginService.makeActive(id).subscribe(
      dat => {
        this.loginService.getUsers().subscribe(
          data => {
            this.users = data;
          })
      }
    )

  }
  // unsubscribe(email: string, token: string, event: string) {
  //   //get event from DB
  //   this.visitorservice.unsubscribe(email, token, event).subscribe(
  //     data => {
  //       this.visitors = data;
  //       this.isUnregistered = true;
  //     }),
  //     error => console.log(error);
  // }

}
