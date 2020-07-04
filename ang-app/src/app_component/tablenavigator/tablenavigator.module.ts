import { NgModule }                               from '@angular/core';
import { CommonModule }                           from '@angular/common';
import { TableNavigatorComponent }                from './tablenavigator.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [TableNavigatorComponent],
  exports: [TableNavigatorComponent]
})
export class TableNavigatorModule { }
