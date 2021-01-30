import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomValidators } from '../custom-validators';
import { DialogService } from '../_services/dialog.service';
import { EventService } from '../_services/event.service';
import { VisitorService } from "../_services/visitor.service";


@Component({
  selector: 'registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css']
})

export class RegistrationFormComponent implements OnInit {
  submitted = false;
  isRegistered = false;
  activeEvents: Event[];
  url: string;
  urlParams: string[];
  params: string[];
  visitors: any;
  isError = false;
  errorMessage: string;
  isUnsubscribed = false;
  registerForm: FormGroup;
  urlToken: string;
  urlEvent: string;

  constructor(private userService: VisitorService,
    private eventService: EventService,
    private dialogService: DialogService,
    private router: Router,
    private fb: FormBuilder) { }

  get f() { return this.registerForm.controls; }


  emailPattern = new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$");

  ngOnInit() {
    this.url = this.router.url;
    this.urlParams = this.url.split("?");
    if (this.urlParams.length > 1 && this.urlParams[0].includes("unsubscribe")) {
      this.params = this.urlParams[1].split("&");
      if (this.params.length == 2) {
        this.params.forEach(childObj => {
          var child = childObj.split("=");
          if (child[0] == "token") {
            this.urlToken = child[1];
          }
          if (child[0] == "event") {
            this.urlEvent = child[1];
          }

        });
        console.log("PARAMS: " + this.params);

        this.userService.unsubscribe(this.urlToken, this.urlEvent).subscribe(
          data => {
            this.visitors = data;
            this.isUnsubscribed = true;
            this.dialogService.openResponseDialog('check_circle_outline', 'Odhlásený', this.visitors.message);
            console.log("UNSUBSCRIBED: " + this.visitors.follower.email);
          },
          error => {
            this.visitors = error;
            this.dialogService.openResponseDialog('highlight_off', 'Error!', this.visitors.error.message);
            this.isError = true;
          }
        )
      } else {
        //not valid URL
        this.isError = true;
        this.errorMessage = "Not valid URL !!!";
      }
    } else {
      this.eventService.getActiveEventList().subscribe(
        data => {
          this.activeEvents = data;
        }
      );

      this.registerForm = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required,
        CustomValidators.patternValidator(this.emailPattern, { emailValid: true })]],
        course: ['', [Validators.required]],
        gdpr: [''],
      });
    }
  }

  exit() {
    this.router.navigate(["/registration"]);
    window.location.reload();
  }

  exitOnUnsubscribed() {
    this.router.navigate(["/registration"]);
    window.location.reload();
  }

  onSubmit() {
    this.submitted = true;
    console.log(this.registerForm.value);

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      console.log('FORM IS INVALID');
      return;
    }
    this.userService.register(this.registerForm.value).subscribe(
      response => {
        this.visitors = response;
        // console.log('RESPONSE: ', response);
        this.isRegistered = true;
      },
      error => {
        this.visitors = error;
        // console.log('ERROR ON RESPONSE', error);
        this.isError = true;
      }
    );
  }

}
