import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    if (!control.value) {
      // if control is empty return no error
      return null;
    }

    // test the value of the control against the regexp supplied
    const valid = regex.test(control.value);

    // if true, return no error, else return error passed in the second parameter
    return valid ? null : error;
  };
}


export function mustMatch(controlName: string, matchingControlName: string, error: ValidationErrors): ValidatorFn {

  return (abstractControl: AbstractControl): { [key: string]: boolean } => {
    const control = abstractControl[controlName];
    const matchingControl = abstractControl[matchingControlName];

    if (matchingControl.errors && !matchingControl.errors.error.key) {
      // return if another validator has already found an error on the matchingControl
      return;
    }

    // set error on matchingControl if validation fails
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors(error);
    } else {
      matchingControl.setErrors(null);
    }
  };
}

export function passwordMatcher(abstractControl: AbstractControl, error: ValidationErrors): { [key: string]: boolean } | null {
  const newPassword = abstractControl.get('newPassword');
  const confirmPassword = abstractControl.get('confirmPassword');

  if (newPassword.pristine || confirmPassword.pristine) {
    return null;
  }

  if (newPassword.value !== confirmPassword.value) {
    confirmPassword.setErrors(error);
    return error;
  } else {
    confirmPassword.setErrors(null);
    return null;
  }

}

export class CustomValidators {

  static validateEmailPattern(): ValidatorFn {
    return patternValidator(new RegExp('^[a-zA-Z0-9]+[a-zA-Z0-9._%+-]*[a-zA-Z0-9]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'), {emailValid: true});
  }

  static containsAtLeastOneNumber(): ValidatorFn {
    return patternValidator(new RegExp('[0-9]'), {hasNumber: true});
  }

  static containsAtLeastOneSmallChar(): ValidatorFn {
    return patternValidator(new RegExp('[a-z]'), {hasSmallChars: true});
  }

  static containsAtLeastOneBigChar(): ValidatorFn {
    return patternValidator(new RegExp('[A-Z]'), {hasBigChars: true});
  }

  static mustMatch(controlName, matchingControlName): ValidatorFn {
    return mustMatch(controlName, matchingControlName, {mustMatch: true});
  }

  static passwordMatcher(controlName): ValidationErrors {
    return passwordMatcher(controlName, {mustMatch: true});
  }
}
