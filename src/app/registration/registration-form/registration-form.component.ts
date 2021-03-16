import {Component, OnInit} from '@angular/core';
import {DialogService} from '../../_services/dialog.service';
import {EventService} from '../../_services/event.service';
import {FollowerService} from '../../_services/follower.service';
import {AbstractControl} from '@angular/forms';


@Component({
  selector: 'registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css']
})

export class RegistrationFormComponent implements OnInit {
  activeEvents: Event[];
  visitor: any;

  constructor(public followerService: FollowerService,
              private eventService: EventService,
              private dialogService: DialogService) {
  }

  get f(): {[p: string]: AbstractControl} {
    return this.followerService.registerForm.controls;
  }

  ngOnInit(): void {
    this.eventService.getActiveEventList().subscribe(
      data => {
        this.activeEvents = data.response.body;
      }
    );
  }

  onSubmit(): void {

    // stop here if form is invalid
    if (this.followerService.registerForm.invalid) {
      console.log('FORM IS INVALID');
      return;
    }
    this.followerService.register(this.followerService.registerForm.value).subscribe(
      data => {
        this.visitor = data.response;
        if (data.response.body.accepted) {
          this.dialogService.openWideSuccessResponseDialog('Prihlásený', data.response.message, '/home');
        }
        if (!data.response.body.accepted) {
          this.dialogService.openWideWaitingResponseDialog('V poradí', data.response.message, '/home');
        }
      },
      error => {
        this.visitor = error.error.message;
        this.dialogService.openErrorResponseDialog('Error', error.error.message, '/home');
      }
    );
  }

}
