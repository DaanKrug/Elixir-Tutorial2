import { NgModule }                               from '@angular/core';
import { CommonModule }                           from '@angular/common';
import { FormActionComponent }                    from './formaction.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [FormActionComponent],
  exports: [FormActionComponent]
})
export class FormActionModule { }
