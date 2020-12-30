import { Component, OnInit } from '@angular/core';
// import { NgForm } from '@angular/forms';
import { FormGroup, FormBuilder } from '@angular/forms';

import { Customer } from './customer';

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
      firstName: "",
      lastName: {value: 'n/a', disabled: false},
      email: "",
      sendCatalog: {value: true, disabled: false},// Get more fancy
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
}
