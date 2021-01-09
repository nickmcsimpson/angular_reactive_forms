import { Component, OnInit } from '@angular/core';
// import { NgForm } from '@angular/forms';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn, FormArray } from '@angular/forms';

import { debounceTime } from 'rxjs/operators';
import { Customer } from './customer';

function emailMatcher(c: AbstractControl): { [key: string]: boolean } | null {
  const emailControl = c.get('email');
  const confirmControl = c.get('confirmEmail');

  if (emailControl.pristine || confirmControl.pristine) {
    return null;
  }

  if (emailControl.value === confirmControl.value) {
    return null;
  }
  return { 'match': true };
}

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
  emailMessage: string;

  get addresses(): FormArray {
    return <FormArray>this.customerForm.get('addresses');
  }

  private validationMessages = {
    required: 'Please enter your email address.',
    email: 'Please enter a valid email address.',
  };

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
      emailGroup: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        confirmEmail: ['', Validators.required],
      }, {validator: emailMatcher}),
      sendCatalog: {value: true, disabled: false},// Get more fancy
      phone: '',
      notification: 'email',
      rating: [null, ratingRange(1,5)],

      // Form Group Array for dynamic duplication
      addresses: this.fb.array([ this.buildAddress() ]),           
    });

    // Add watchers to input forms
    this.customerForm.get('notification').valueChanges.subscribe(
      value => this.setNotification(value)
    )

    const emailControl = this.customerForm.get('emailGroup.email');
    emailControl.valueChanges.pipe(
      debounceTime(1000)
    ).subscribe(
      valud => this.setMessage(emailControl)
    );
  }

  addAddress(): void {
    this.addresses.push(this.buildAddress());
  }

  // Return FG for dynamic duplication
  buildAddress(): FormGroup {
    return this.fb.group({
      // Mine added for the rest of old form
      addressType: "home",
      street1: "",
      street2: "",
      city: "",
      state: "",
      zip: "",
    })
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

  // Handle error messages in code with Observables
  setMessage(c: AbstractControl): void {
    this.emailMessage = '';
    if((c.touched || c.dirty) && c.errors) {
      this.emailMessage = Object.keys(c.errors).map(
        key => this.validationMessages[key]).join(' ');
    }
  }

  setNotification(notifyVia: string): void {
    const phoneControl = this.customerForm.get('phone');
    if(notifyVia === 'text') {
      phoneControl.setValidators(Validators.required);
    } else {
      phoneControl.clearValidators();
    }
    phoneControl.updateValueAndValidity();
  }
  /**
   * Reactive transformations
   * 
   * debounceTime() ignores until time has passed
   * throttleTime() emits, then ignores for a time
   * distinctUntilChanged() suppresses duplicate consecutive items
   */
}
