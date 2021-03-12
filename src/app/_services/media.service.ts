import {Injectable} from '@angular/core';
import {MediaChange, MediaObserver} from '@angular/flex-layout';
import {Subscription} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  mediaSub$: Subscription;
  deviceXs: boolean;
  deviceSm: boolean;
  deviceMd: boolean;
  deviceLg: boolean;
  deviceSize: string;

  constructor(
    private mediaObserver: MediaObserver) {

    this.mediaSub$ = this.mediaObserver.media$.subscribe((result: MediaChange) => {
      this.deviceLg = result.mqAlias === 'lg';
      this.deviceMd = result.mqAlias === 'md';
      this.deviceSm = result.mqAlias === 'sm';
      this.deviceXs = result.mqAlias === 'xs';
      this.deviceSize = result.mqAlias;
    });
  }

}
