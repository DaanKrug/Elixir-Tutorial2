import { DomSanitizer, Meta } from '@angular/platform-browser';
import { OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, NgbDateStruct, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';

import { BaseCrudComponent } from '../../app_base/basecrud.component';

import { UserServiceRouter } from '../management/user/user.service.router';

import { StorageService } from '../../app_base/storage/storage.service';
import { StringService } from '../../app_base/string/string.service';
import { CacheDataService } from '../../app_base/cache/cache.data.service';
import { DateService } from '../../app_base/date/date.service';
import { CalendarDrawer } from '../../app_base/calendar/calendar.drawer';
import { EventEmitterService } from '../../app_base/event/event.emitter.service';

import { UserService } from '../management/user/user.service';

export class BaseCrudFilterComponent extends BaseCrudComponent implements OnInit, OnDestroy{

    userService: UserService;
    activatedServices: any[];
    signedVariables: any[];
    servicesInitialized: boolean;

    constructor(protected modallService: NgbModal,
			    protected stringService: StringService,
			    protected spinnerr: NgxSpinnerService,
		        protected dateService: DateService, 
		        protected dateConfig: NgbDatepickerConfig,
		        protected eventEmitterService: EventEmitterService,
		        protected http: HttpClient,
		        private storageServicee: StorageService,
		        protected cacheDataService: CacheDataService,
		        protected sanitizer: DomSanitizer,
		        protected router: Router, 
		        protected route: ActivatedRoute,
		        protected userServiceRouter: UserServiceRouter,
		        protected meta: Meta
    			) {
		super();
		this.servicesInitialized = false;
		this.modalService = modallService;
		this.spinner = spinnerr;
		this.stringServicee = stringService;
		this.storageService = this.storageServicee;
		this.messageEmitterService = this.eventEmitterService;
	}
    
	// Do not override!
	getAppId(){
		return this.meta.getTag('name=app-id').content;
	}
	
	// Do not override!
	getAppPrefix(){
		return this.meta.getTag('name=app-prefix').content;
	}
   
    // Do not override!
	sanitizeUrl(url){
		return this.sanitizer.bypassSecurityTrustResourceUrl(url);
	}
	
	// Do not override!
	sanitizeHtml(html){
		html = this.stringService.sanitizeHtml(html);
		return this.sanitizer.bypassSecurityTrustHtml(html);
	}
	
	// Do not override!
	sanitizeCss(css){
		this.sanitizer.bypassSecurityTrustStyle(css);
	}
	 
	ngOnInit() {
		this.ngOnInitWaiter();
	}
	
	ngOnInitWaiter(){
		if(!this.servicesInitialized){
			setTimeout(() => {this.ngOnInitWaiter();},100);
			return;
		}
		super.ngOnInit();
	}
	
	ngOnDestroy(){
        if(null!=this.activatedServices){
        	var size = this.activatedServices.length;
        	for(var i = 0; i < size; i++){
        		this.activatedServices[i].ngOnDestroy();
        	}
        }
        if(null!=this.signedVariables){
        	var size = this.signedVariables.length;
    		for(var i = 0; i < size; i++){
    			this.signedVariables[i] = null;
    		}
        }
        this.activatedServices = null;
        this.signedVariables = null;
	    this.servicesInitialized = null;
		super.ngOnDestroy();
	}
	
	setInitializationServices(toAactivateServices: string[]){
        if(toAactivateServices.includes('user')){
        	this.userService = new UserService(this.http);
      	    this.injectServiceDependencies(this.userService);
		}
		this.servicesInitialized = true;
	}
	
	private injectServiceDependencies(objService){
		objService.setStorageService(this.storageService);
		objService.setCacheDataService(this.cacheDataService);
		objService.setMeta(this.meta);
		this.addInitializedService(objService);
	}
	
	private addInitializedService(objService){
		if(this.emptyArray(this.activatedServices)){
			this.activatedServices = [];
		}
		this.activatedServices = [...this.activatedServices,objService];
		this.addSignedVariables([objService]);
	}
	
	private addSignedVariables(arrVariables){
		if(this.emptyArray(this.signedVariables)){
			this.signedVariables = [];
		}
		var size = arrVariables.length;
		for(var i = 0; i < size; i++){
			this.signedVariables = [...this.signedVariables,arrVariables[i]];
		}
	}
	
    getNameToFilterCondition(){
    	if(!this.emptyString(this.nameToFilter)){
    	    return ' xoo name xstrike quaspa%' + this.nameToFilter.trim() + '%quaspa ';
	    }
	    return '';
    }
	        
	infoContainGeneric(oa,ea,titles,title,label,byFieldName){
		var msg = '- São carregad' + oa + 's no máximo ' + oa + 's primeir' + oa;
		msg += 's 5 ' + titles + ' para a seleção.';
		msg += '<br/>';
		msg += '- Utilize o campo <strong>' + title;
		msg +=' Contém</strong> para fazer com que ess' + ea + 's 5 ' + label + 's para a seleção,';
		msg += ' sejam pré filtrad' + oa + 's ' + byFieldName + '. Assim qualquer ';
		msg += label + ' existente poderá ser selecionad' + oa + '.';
		this.openMessage(title + ' Contém',msg);
	}
	      
	patchValue(target,value){
		if(target == 'name'){
			this.dataForm.patchValue({name: value});
		}
		if(target == 'username'){
			this.dataForm.patchValue({username: value.toLowerCase()});
		}
		if(target == 'email'){
			this.dataForm.patchValue({email: value.toLowerCase()});
		}
	}

}