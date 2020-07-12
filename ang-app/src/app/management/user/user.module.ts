import { CommonModule }                            from '@angular/common';
import { NgModule }                                from '@angular/core';
import { FormsModule, ReactiveFormsModule }        from '@angular/forms';
import { NgbModule }                               from '@ng-bootstrap/ng-bootstrap';
import { UserRoutingModule }                       from './user-routing.module';
import { UserComponent }                           from './user.component';
import { CustomComponentsModule }                  from '../../../app_component/customcomponents.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule, 
    ReactiveFormsModule,
    NgbModule,
    UserRoutingModule,
    CustomComponentsModule
  ],
  declarations: [UserComponent]
})
export class UserModule { }
