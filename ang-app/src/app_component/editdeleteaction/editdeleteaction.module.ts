import { NgModule }                               from '@angular/core';
import { CommonModule }                           from '@angular/common';
import { NgbModule }                              from '@ng-bootstrap/ng-bootstrap';
import { EditDeleteActionComponent }              from './editdeleteaction.component';

@NgModule({
  imports: [
    CommonModule, NgbModule
  ],
  declarations: [EditDeleteActionComponent],
  exports: [EditDeleteActionComponent]
})
export class EditDeleteActionModule { }
