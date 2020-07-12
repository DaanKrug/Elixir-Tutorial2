import { Component, EventEmitter, Input, Output, OnInit, OnDestroy }  from '@angular/core';

@Component({
  selector: 'form-toolbar',
  templateUrl: './formtoolbar.component.html'
})
export class FormToolbarComponent implements OnInit, OnDestroy{

  @Input() title: string;
  @Input() editing: boolean;
  @Input() auditingExclusions: boolean;
  @Input() enabledAuditList: boolean;
  @Input() disabledAddNew: boolean;
  @Input() searchForm: any;
  @Input() backToOrigin: boolean;
  @Input() useReport: boolean;
  @Input() hiddeRefresh: boolean;
  @Input() hiddeAddNew: boolean;
  @Input() moreFilters: boolean;
  @Input() selectOptionsLabel: string;
  @Input() selectOptionsValues: string;
  @Input() selectOptionsLabel2: string;
  @Input() selectOptionsValues2: string;
  @Input() selectOptionsLabel3: string;
  @Input() selectOptionsValues3: string;
  @Input() selectOptionsLabel4: string;
  @Input() selectOptionsValues4: string;
  
  
  @Output() onSearchFormSubmitEmitter = new EventEmitter<void>();
  @Output() listDataEmitter = new EventEmitter<void>();
  @Output() listDataNoCacheEmitter = new EventEmitter<void>();
  @Output() auditListEmitter = new EventEmitter<void>();
  @Output() normalListEmitter = new EventEmitter<void>();
  @Output() addObjectEmitter = new EventEmitter<void>();
  @Output() backToOriginEmitter = new EventEmitter<void>();
  @Output() toReportEmitter = new EventEmitter<void>();
  @Output() moreFilterOptionsEmitter = new EventEmitter<void>();
  @Output() lessFilterOptionsEmitter = new EventEmitter<void>();
  @Output() filterBySelectEmitter = new EventEmitter<number>();
  @Output() filterBySelectEmitter2 = new EventEmitter<number>();
  @Output() filterBySelectEmitter3 = new EventEmitter<number>();
  @Output() filterBySelectEmitter4 = new EventEmitter<number>();
  
  ngOnInit(){}
  ngOnDestroy(){
      this.title = null;
      this.editing = null;
      this.auditingExclusions = null;
      this.enabledAuditList = null;
      this.disabledAddNew = null;
      this.searchForm = null;
      this.backToOrigin = null;
      this.useReport = null;
      this.hiddeRefresh = null;
      this.hiddeAddNew = null;
      this.moreFilters = null;
      this.selectOptionsLabel = null;
      this.selectOptionsValues = null;
      this.selectOptionsLabel2 = null;
      this.selectOptionsValues2 = null;
      this.selectOptionsLabel3 = null;
      this.selectOptionsValues3 = null;
      this.selectOptionsLabel4 = null;
      this.selectOptionsValues4 = null;
      this.onSearchFormSubmitEmitter = null;
      this.listDataEmitter = null;
      this.listDataNoCacheEmitter = null;
      this.auditListEmitter = null;
      this.addObjectEmitter = null;
      this.backToOriginEmitter = null;
      this.toReportEmitter = null;
      this.moreFilterOptionsEmitter = null;
      this.lessFilterOptionsEmitter = null;
      this.filterBySelectEmitter = null;
      this.filterBySelectEmitter2 = null;
      this.filterBySelectEmitter3 = null;
      this.filterBySelectEmitter4 = null;
  }
  
  onSearchFormSubmit(){
      this.onSearchFormSubmitEmitter.emit();
  }
  
  listData(){
      this.listDataEmitter.emit();
  }
  
  listDataNoCache(){
      this.listDataNoCacheEmitter.emit();
  }
  
  auditList(){
  	  this.auditListEmitter.emit();
  }
  
  normalList(){
  	  this.normalListEmitter.emit();
  }
  
  addObject(){
  	  this.addObjectEmitter.emit();
  }
  
  goBackToOrigin(){
  	  if(!this.backToOrigin){return;}
  	  this.backToOriginEmitter.emit();
  }
  
  toReport(){
  	  this.toReportEmitter.emit();
  }
  
  moreFilterOptions(){
  	  this.moreFilterOptionsEmitter.emit();
  }
  
  lessFilterOptions(){
  	  this.lessFilterOptionsEmitter.emit();
  }
  
  filterBySelect(position: number){
      this.filterBySelectEmitter.emit(position);
  }
  
  filterBySelect2(position: number){
      this.filterBySelectEmitter2.emit(position);
  }
  
  filterBySelect3(position: number){
      this.filterBySelectEmitter3.emit(position);
  }
  
  filterBySelect4(position: number){
      this.filterBySelectEmitter4.emit(position);
  }
  
}


