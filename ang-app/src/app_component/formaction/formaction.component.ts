import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'form-action',
  templateUrl: './formaction.component.html'
})
export class FormActionComponent implements OnInit, OnDestroy{

  @Input() validationMessages: any[];
  @Input() processValidation: boolean;
  @Input() additionalMsgsInfo: string[];
  @Input() saveText: string;
  @Input() noCancel: boolean;
  @Input() passwordValidationMessage: any;
  
  @Output() cancelDataEmitter = new EventEmitter<void>();
  
  ngOnInit(){}
  ngOnDestroy(){
      this.validationMessages = null;
      this.processValidation = null;
      this.additionalMsgsInfo = null;
      this.saveText = null;
      this.noCancel = null;
      this.passwordValidationMessage = null;
      this.cancelDataEmitter = null;
  }
  
  cancelData(){
      this.cancelDataEmitter.emit();
  }
  
}


