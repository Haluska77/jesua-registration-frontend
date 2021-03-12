import {Component, OnDestroy, OnInit} from '@angular/core';
import {MediaService} from '../_services/media.service';
import {TokenService} from '../_services/token.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  constructor(public tokenService: TokenService,
              public mediaService: MediaService) {
  }

  ngOnInit(): void {
  }


  ngOnDestroy(): void {
    this.mediaService.mediaSub$.unsubscribe();
  }
}
