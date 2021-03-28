import {Component, OnInit} from '@angular/core';
import {TokenService} from './_services/token.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  constructor(
    private tokenService: TokenService) {
  }

  ngOnInit(): void {
    this.tokenService.initialize();
  }

}
