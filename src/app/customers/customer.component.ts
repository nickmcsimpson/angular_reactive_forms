import { Component, OnInit } from '@angular/core';
// import { NgForm } from '@angular/forms';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn } from '@angular/forms';

import { Customer } from './customer';

// Custom validator added outside the component class
  // if parameters are needed, you must have a 'factory' function to wrap it
function ratingRange(min: number, max: number): ValidatorFn {
  return (c: AbstractControl): { [key: string]: boolean } | null => {
    if(c.value !== null && (isNaN(c.value) || c.value < min || c.value > max)) {
      return { 'range': true };
    }
    return null;
  };
}
@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  customerForm: FormGroup;
  customer = new Customer();

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    // Create instance when form is initialized
    // Manual Form Model declaration
    // this.customerForm = new FormGroup({
    //   //add form controls/groups
    //   firstName: new FormControl(),
    //   lastName: new FormControl(),
    //   email: new FormControl(),
    //   sendCatalog: new FormControl(true),
    // });

    // Using FormBuilder
    this.customerForm = this.fb.group({
      // Initialize with [] for validation
        // 1: value 2: [] of validators 3: [] async validators
      firstName: ['', 
        [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      sendCatalog: {value: true, disabled: false},// Get more fancy
      phone: '',
      notification: 'email',
      rating: [null, ratingRange(1,5)],

      // Mine added for the rest of old form
      addressType: false,
      street1: "",
      street2: "",
      city: "",
      state: "",
      zip: "",
    });
  }

  populateTestData(): void {
    this.customerForm.setValue({// Must set all values
      firstName: "Jack",
      lastName: "Harkness",
      email: "jackHarkness@gmail.com",
      sendCatalog: false,
    });

    // Use patchValue for a subset
  }

  save(): void {
      console.log(this.customerForm);
      console.log('Saved: ' + JSON.stringify(this.customerForm.value));
    }

  // Old template save:
  // save(customerForm: NgForm): void {
  //   console.log(customerForm.form);
  //   console.log('Saved: ' + JSON.stringify(customerForm.value));
  // }

  setNotification(notifyVia: string): void {
    const phoneControl = this.customerForm.get('phone');
    if(notifyVia === 'text') {
      phoneControl.setValidators(Validators.required);
    } else {
      phoneControl.clearValidators();
    }
    phoneControl.updateValueAndValidity();
  }
}
