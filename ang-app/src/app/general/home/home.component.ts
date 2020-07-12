import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';

import { BaseComponent } from '../../../app_base/base.component';

@Component({
  selector: 'home-root',
  templateUrl: './home.component.html',
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false
})
export class HomeComponent extends BaseComponent implements OnInit, OnDestroy{
	
    constructor(){
    	super();
    }

	ngOnInit(){
		super.ngOnInit();
	}
	
	ngOnDestroy(){
		super.ngOnDestroy();
	}
}




