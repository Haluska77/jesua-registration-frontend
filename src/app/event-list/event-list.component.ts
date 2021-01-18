import { Component, OnInit } from '@angular/core';
import { EventService } from '../_services/event.service';
import { Event } from '../_models/event';
import { Observable, Subject } from "rxjs";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css'],
  providers: [DatePipe]
})
export class EventListComponent implements OnInit {

  constructor(private eventservice: EventService,
    private datePipe: DatePipe) { }

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();


  events: Observable<Event[]>;
  event: Event = new Event();
  deleteMessage = false;
  isupdated = false;


  ngOnInit() {
    this.isupdated = false;
    this.dtOptions = {
      pageLength: 5,
      stateSave: true,
      lengthMenu: [[5, 10, 20, -1], [5, 10, 20, "All"]],
      processing: true
    };
    this.eventservice.getEventList().subscribe(
      data => {
        this.events = data;
        this.dtTrigger.next();
      })
  }

  eventupdateform = new FormGroup({
    id: new FormControl(),
    description: new FormControl(),
    startDate: new FormControl(),
    visible: new FormControl()
  });

  getCurrentEvent(id: number) {
    //get event from DB
    this.eventservice.getEvent(id).subscribe(
      // fill in the form by retrieved event
      data => {
        this.fillUpdateForm(data)
      },
      error => console.log(error));
  }

  fillUpdateForm(event: Event) {
    this.eventupdateform.patchValue({
      id: event.id,
      description: event.description,
      startDate: this.datePipe.transform(event.startDate, 'yyyy-MM-ddTHH:mm'),
      visible: event.visible
    })
    console.log("ID: " + event.id);
    console.log("Date: " + event.startDate);
  }

  updateStu(updstu) {
    //set 'event' from Form
    this.event = new Event();
    this.event.id = this.eventupdateform.get('id').value;
    this.event.description = this.eventupdateform.get('description').value;
    this.event.startDate = this.eventupdateform.get('startDate').value;
    this.event.visible = this.eventupdateform.get('visible').value;

    // update event in DB
    this.eventservice.updateEvent(this.event.id, this.event).subscribe(
      data => {
        this.isupdated = true;
        //reload updated event list from DB
        this.eventservice.getEventList().subscribe(data => {
          this.events = data
        })
      },
      error => console.log(error));
  }

  deleteEvent(id: number) {
    //delete event in DB
    this.eventservice.deleteEvent(id)
      .subscribe(
        data => {
          this.deleteMessage = true;
          //reload updated event list from DB
          this.eventservice.getEventList().subscribe(data => {
            this.events = data
          })
        },
        error => console.log(error));
  }


  changeisUpdate() {
    this.isupdated = false;
  }
}
