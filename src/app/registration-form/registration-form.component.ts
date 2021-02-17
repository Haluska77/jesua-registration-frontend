import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {CustomValidators} from '../custom-validators';
import {DialogService} from '../_services/dialog.service';
import {EventService} from '../_services/event.service';
import {VisitorService} from '../_services/visitor.service';
import {SpinnerService} from '../_services/spinner.service';


@Component({
  selector: 'registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css']
})

export class RegistrationFormComponent implements OnInit {
  activeEvents: Event[];
  visitor: any;
  registerForm: FormGroup;

  constructor(private userService: VisitorService,
              private eventService: EventService,
              private dialogService: DialogService,
              private router: Router,
              private route: ActivatedRoute,
              private fb: FormBuilder,
              public spinnerService: SpinnerService) {
  }

  get f() {
    return this.registerForm.controls;
  }


  emailPattern = new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$');

  ngOnInit() {
    this.eventService.getActiveEventList().subscribe(
      data => {
        this.activeEvents = data.response.body;
      }
    );

    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required,
        CustomValidators.patternValidator(this.emailPattern, {emailValid: true})]],
      course: ['', [Validators.required]],
      gdpr: [''],
    });
  }

  onSubmit() {
    console.log(this.registerForm.value);

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      console.log('FORM IS INVALID');
      return;
    }
    this.userService.register(this.registerForm.value).subscribe(
      data => {
        this.visitor = data.response;
        if (data.response.body.accepted) {
          this.dialogService.openSuccessResponseDialog('Prihlásený', data.response.message, '/home');
        }
        if (!data.response.body.accepted) {
          this.dialogService.openWaitingResponseDialog('V poradí', data.response.message, '/home');
        }
      },
      error => {
        this.visitor = error.error.message;
        this.dialogService.openErrorResponseDialog('Error', error.error.message, '/home');
      }
    );
  }

}
