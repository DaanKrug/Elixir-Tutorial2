import { NgModule }                               from '@angular/core';
import { CommonModule }                           from '@angular/common';
import { FormsModule, ReactiveFormsModule }       from '@angular/forms';
import { NgbModule }                              from '@ng-bootstrap/ng-bootstrap';
import { FormToolbarComponent }                   from './formtoolbar.component';

@NgModule({
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, NgbModule
  ],
  declarations: [FormToolbarComponent],
  exports: [FormToolbarComponent]
})
export class FormToolbarModule { }
