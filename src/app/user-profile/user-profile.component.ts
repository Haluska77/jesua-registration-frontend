import { Component, OnInit } from '@angular/core';
import { LoginService } from '../_services/login.service';
import { TokenService } from '../_services/token.service';


@Component({
  selector: 'app-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  currentUser: any;
  isAuthorized = true;
 
  constructor(private token: TokenService,
    private loginService: LoginService) { }

  ngOnInit() {
    if (!!this.token.getUser()) {
      this.isAuthorized = true;
      this.currentUser = this.token.getUser();
    
    } else {
      this.isAuthorized = false;

    }
  }
}
