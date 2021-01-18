import { Component, OnInit } from '@angular/core';
import { EventService } from '../_services/event.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Event } from '../_models/event';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})

export class EventFormComponent implements OnInit {

  constructor(private eventService: EventService) { }

  event: Event = new Event();
  submitted = false;

  ngOnInit() {
    this.submitted = false;
  }

  eventForm = new FormGroup({
    description: new FormControl('', [Validators.required]),
    startDate: new FormControl('', [Validators.required]),
    visible: new FormControl()
  });

  saveEvent(saveEvent) {
    this.event = new Event();
    this.event.description = this.eventForm.get('description').value;
    this.event.startDate = this.eventForm.get('startDate').value;
    this.event.visible = this.eventForm.get('visible').value;
    this.submitted = true;
    this.save();
  }

  save() {
    this.eventService.createEvent(this.event)
      .subscribe(data => console.log(data), error => console.log(error));
    this.event = new Event();
  }

  get f() { return this.eventForm.controls; }

  addEventForm() {
    this.submitted = false;
    this.eventForm.reset();
  }
}

