import { NgModule }                               from '@angular/core';
import { CommonModule }                           from '@angular/common';
import { CaptchaComponent }                       from './captcha.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [CaptchaComponent],
  exports: [CaptchaComponent]
})
export class CaptchaModule { }
