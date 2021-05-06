import {AbstractControl, AsyncValidatorFn, ValidationErrors} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {ProjectService} from './_services/project.service';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ProjectAsyncValidator {

  constructor(private projectService: ProjectService) {
  }

  duplicateShortName(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.projectService.getProjects(control.value)
        .pipe(
          map(data => data.response.body.length > 0 ? {duplicateShortName: true} : null),
          tap(result => console.log(result))
        );
    };
  }
}
