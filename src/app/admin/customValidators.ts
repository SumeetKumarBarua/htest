import { FormArray, FormControl, FormGroup, ValidationErrors } from '@angular/forms';

export class CustomValidators {
  static vaildContainerName(c: FormControl): ValidationErrors {
    const cnum = c.value;
    var reg = /^[a-zA-z]{4}[0-9]{7}$/
    var isValid = true;
    const message = {
      'vaildCnum': {
        'message': 'Should comprise of 4 alphabets followed by 7 digits. eg:ASWD3213456.'
      }
    };
    if (reg.test(cnum)) {
      isValid = true;
    }
    else {
      isValid = false;
    }
    return isValid ? null : message;
  }
}




