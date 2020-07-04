import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'edit-delete-action',
  templateUrl: './editdeleteaction.component.html'
})
export class EditDeleteActionComponent implements OnInit, OnDestroy{

  @Input() auditingExclusions: boolean;
  @Input() logged: any;
  @Input() object: any;
  @Input() objectDeleteConfirmation: any;
  @Input() objectUnDeleteConfirmation: any;
  @Input() objectDetail: any;
  @Input() noEdit: boolean;
  @Input() noAction: boolean;
  @Input() lockUnLock: boolean;

  @Output() showObjectEmitter = new EventEmitter<object>();
  @Output() editObjectEmitter = new EventEmitter<number>();
  @Output() deleteObjectEmitter = new EventEmitter<object>();
  @Output() unDeleteObjectEmitter = new EventEmitter<object>();
  @Output() lockEmitter = new EventEmitter<number>();
  @Output() unlockEmitter = new EventEmitter<number>();
  
  ngOnInit(){}
  ngOnDestroy(){
      this.auditingExclusions = null;
      this.logged = null;
      this.object = null;
      this.objectDeleteConfirmation = null;
      this.objectUnDeleteConfirmation = null;
      this.objectDetail = null;
      this.noEdit = null;
      this.noAction = null;
      this.lockUnLock = null;
      this.showObjectEmitter = null;
      this.editObjectEmitter = null;
      this.deleteObjectEmitter = null;
      this.unDeleteObjectEmitter = null;
      this.lockEmitter = null;
      this.unlockEmitter = null;
  }
  
  lock(id: number){
  	  this.lockEmitter.emit(id);
  }
  
  unlock(id: number){
  	  this.unlockEmitter.emit(id);
  }
  
  showObject(id: number, modalId: any){
  	  this.showObjectEmitter.emit({id: id,modalId: modalId});
  }
  
  editObject(id: number){
  	  this.editObjectEmitter.emit(id);
  }
  
  deleteObject(id: number, modalId: any){
  	  this.deleteObjectEmitter.emit({id: id,modalId: modalId});
  }
  
  unDeleteObject(id: number, modalId: any){
  	  this.unDeleteObjectEmitter.emit({id: id,modalId: modalId});
  }
  
}
