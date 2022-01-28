import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from '../_services/dialog.service';
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
    private tokenService: TokenService,
    private dialogService: DialogService
    ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(
      p=> {
        this.tokenService.saveToken(p.token);
        this.oauthService.getOauthUser().subscribe((data: any) => {
          this.tokenService.saveToken(data.response.body.token);
          this.tokenService.saveUser(data.response.body);
          this.router.navigate(['/profile'])
            .then(() => {
              window.location.reload();
            });
        }, error => {
          this.dialogService.openErrorResponseDialog('Error', error.error.error.message, 'login');
          this.tokenService.signOut();
        });
      }
    )
  }
}