import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OauthService } from '../_services/oauth.service';
import { TokenService } from '../_services/token.service';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.css']
})
export class CallbackComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private router: Router,
              private oauthService: OauthService,
              private tokenService: TokenService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(p=> {
      this.oauthService.getOauthToken(p.code, p.state).subscribe((data:any) => {
        this.tokenService.saveToken(data.accessToken);
        this.oauthService.getOauthUser().subscribe((data: any) => {
          this.tokenService.saveToken(data.response.body.token);
          this.tokenService.saveUser(data.response.body);
          this.router.navigate(['/profile'])
          .then(() => {
            window.location.reload();
          });
            });
      });

  })
}

}
