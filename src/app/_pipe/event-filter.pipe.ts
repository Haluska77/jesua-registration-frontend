import {Pipe, PipeTransform} from '@angular/core';
import {EventDetail} from '../home/home.component';

@Pipe({
  name: 'eventFilter',
  pure: true
})
export class EventFilterPipe implements PipeTransform {
  transform(events: EventDetail[], projectSearch: number, openSearch: boolean, dateFromSearch: string, dateToSearch: string, filteredCount: any): EventDetail[] {

    if (projectSearch !== undefined) {
      events = events.filter(eventDetail => eventDetail.event.project.id === projectSearch);
    }
    if (openSearch === true) {
      events = events.filter(eventDetail => eventDetail.state === 'free');
    }

    const dateFromPipe = new Date(dateFromSearch);
    if (dateFromSearch !== undefined) {
      events = events.filter(function (eventDetail: EventDetail) {
        const startDate = new Date(eventDetail.event.startDate);
        return startDate > dateFromPipe;
      });
    }

    const dateToPipe = new Date(dateToSearch);
    dateToPipe.setDate(dateToPipe.getDate() + 1);
    if (dateToSearch !== undefined) {
      events = events.filter(function (eventDetail: EventDetail) {
        const startDateFrom = new Date(eventDetail.event.startDate);
        return startDateFrom < dateToPipe;
      });
    }

    filteredCount.count = events?.length;

    return events;
  }

}
