import { NgModule }                               from '@angular/core';
import { CommonModule }                           from '@angular/common';
import { DeleteConfirmationComponent }            from './deleteconfirmation.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [DeleteConfirmationComponent],
  exports: [DeleteConfirmationComponent]
})
export class DeleteConfirmationModule { }
