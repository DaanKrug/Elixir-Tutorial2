import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'table-navigator',
  templateUrl: './tablenavigator.component.html'
})
export class TableNavigatorComponent implements OnInit, OnDestroy{

  @Input() previousPageDisabled: boolean;
  @Input() nextPageDisabled: boolean;
  @Input() selectedPage: number;
  @Input() pages: number[];
  @Input() rowsPerPage: number;
  @Input() totalPages: number;
  @Input() totalRows: number;
  
  @Output() previousPageEmitter = new EventEmitter<void>();
  @Output() setPageEmitter = new EventEmitter<number>();
  @Output() nextPageEmitter = new EventEmitter<void>();
  
  ngOnInit(){}
  ngOnDestroy(){
      this.previousPageDisabled = null;
      this.nextPageDisabled = null;
      this.selectedPage = null;
      this.pages = null;
      this.rowsPerPage = null;
      this.totalPages = null;
      this.totalRows = null;
      this.previousPageEmitter = null;
      this.setPageEmitter = null;
      this.nextPageEmitter = null;
  }
  
  previousPage(){
      this.previousPageEmitter.emit();
  }
  
  setPage(page: number){
  	  this.setPageEmitter.emit(page);
  }
  
  nextPage(){
      this.nextPageEmitter.emit();
  }
  
}


