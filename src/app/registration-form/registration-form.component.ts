import {Component, OnInit} from '@angular/core';
import {DialogService} from '../_services/dialog.service';
import {EventService} from '../_services/event.service';
import {VisitorService} from '../_services/visitor.service';
import {SpinnerService} from '../_services/spinner.service';
import {AbstractControl} from '@angular/forms';


@Component({
  selector: 'registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css']
})

export class RegistrationFormComponent implements OnInit {
  activeEvents: Event[];
  visitor: any;

  constructor(public visitorService: VisitorService,
              private eventService: EventService,
              private dialogService: DialogService,
              public spinnerService: SpinnerService) {
  }

  get f(): {[p: string]: AbstractControl} {
    return this.visitorService.registerForm.controls;
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
    if (this.visitorService.registerForm.invalid) {
      console.log('FORM IS INVALID');
      return;
    }
    this.visitorService.register(this.visitorService.registerForm.value).subscribe(
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
