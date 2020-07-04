import { NgModule }                           from '@angular/core';
import { TableNavigatorModule }               from './tablenavigator/tablenavigator.module';
import { EditDeleteActionModule }             from './editdeleteaction/editdeleteaction.module';
import { FormActionModule }                   from './formaction/formaction.module';
import { FormToolbarModule }                  from './formtoolbar/formtoolbar.module';
import { DeleteConfirmationModule }           from './deleteconfirmation/deleteconfirmation.module';
import { CaptchaModule }                      from './captcha/captcha.module';


@NgModule({
  imports: [
    TableNavigatorModule, EditDeleteActionModule, FormActionModule, 
    FormToolbarModule, DeleteConfirmationModule, CaptchaModule
  ],
  declarations: [],
  exports: [
    TableNavigatorModule, EditDeleteActionModule, FormActionModule, 
    FormToolbarModule, DeleteConfirmationModule, CaptchaModule
  ]
})
export class CustomComponentsModule { }
