import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'delete-confirmation',
  templateUrl: './deleteconfirmation.component.html'
})
export class DeleteConfirmationComponent implements OnInit, OnDestroy{

  @Input() label: string;
  @Input() auditingExclusions: boolean;
  @Input() selectedObject: any;
  @Input() templateOutlet: any;
  @Input() colspan: number;
  @Input() redo: boolean;
  @Input() info: boolean;
  
  @Output() confirmDeleteObjectEmitter = new EventEmitter<number>();
  @Output() cancelDataEmitter = new EventEmitter<void>();
  
  ngOnInit(){
      if(null == this.colspan || !(this.colspan >= 2)){
          this.colspan = 2;
      }
  }
  ngOnDestroy(){
      this.label = null;
      this.auditingExclusions = null;
      this.selectedObject = null;
      this.templateOutlet = null;
      this.colspan = null;
      this.redo = null;
      this.info = null;
      this.confirmDeleteObjectEmitter = null;
      this.cancelDataEmitter = null;
  }
  
  confirmDeleteObject(id: number){
  	  this.confirmDeleteObjectEmitter.emit(id);
  }
  
  cancelData(){
      this.cancelDataEmitter.emit();
  }
  
}


