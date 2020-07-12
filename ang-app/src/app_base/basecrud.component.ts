import { FormGroup, FormControl } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
	   
import { BaseCrudService } from './basecrud.service';
import { BaseComponent } from './base.component';

import { ValidationResult } from './validation/validation.result';

export class BaseCrudComponent extends BaseComponent{
	
	canceling: boolean;
	dataForm: FormGroup;
	searchForm: FormGroup;
	parameterName: string;
	parameterType: string;
	parameterOperator: string;
	conditions: string;
	modalService: NgbModal
	crudService: BaseCrudService;
	objects: any[];
	selectedObject: any;
	title: string;
	listTitle: string;
	addTitle: string;
	editTitle: string;
	editing: boolean;
	showing: boolean;
	auditingExclusions: boolean;
	emptyNewObject: any;
	idObjectEdit: number;
	detailModal: NgbModalRef;
	deleteModal: NgbModalRef;
	formModal: NgbModalRef;
	modalOpen: boolean;
	informationMessage: any;
	deletedAt: string;
	logged: any;
	permissions: string[];
	viewTitleSeparator: string;
	urlBase: string;
	lastRequest: number;
	blockRequest: boolean;
	blockRequestTime: number;
	moreFilters: boolean;
	selectOptionsLabel: string;
	selectOptionsValues: Object[];
	specialConditions: string[];
	specialCondition: string;
	selectOptionsLabel2: string;
	selectOptionsValues2: Object[];
	specialConditions2: string[];
	specialCondition2: string;
	selectOptionsLabel3: string;
	selectOptionsValues3: Object[];
	specialConditions3: string[];
	specialCondition3: string;
	selectOptionsLabel4: string;
	selectOptionsValues4: Object[];
	specialConditions4: string[];
	specialCondition4: string;
	
	// Can be overrided. Take care.
	ngOnInit() {
	    super.ngOnInit();
	    this.parameterType = 'string';
	    this.parameterOperator = '%%';
	    this.searchForm = new FormGroup({
	        parameterValue: new FormControl('', [])
	    });
	    this.setLogged(this.crudService.getStorageService().getAuthUser());
	    this.urlBase = window.location.href.indexOf('?') == -1 ? window.location.href : window.location.href.split('?')[0];
	    this.deletedAt = ' (deleted_at is null or deleted_at = quaspa0000-00-00 00:00quaspa) ';
	    this.emptyNewObject = this.crudService.getEmptyObject(null);
	    this.conditions = null;
	    this.showing = false;
	    this.auditingExclusions = false;
	    this.blockRequestTime = 3000;
        this.listData();
        this.afterNgOnInit();
    }
	
	// Specific to be overrided. Should be called to execute functions that need
	// execute after the ngOnInit() already was finished
	afterNgOnInit(){}
    
	// Do not override!
	setLogged(logged){
		this.logged = logged;
	    this.permissions = (null == this.logged ? [] : this.logged.permissions.split(',')); 
	}
	
	// Do not override!
	moreFilterOptions(){
	    this.moreFilters = true;
	}
	
	// Do not override!
	private noMoreFilterOptions(){
	    this.moreFilters = false;
		this.specialCondition = null;
	    this.specialCondition2 = null;
	    this.specialCondition3 = null;
	    this.specialCondition4 = null;
	}
	 
	// Do not override!
	lessFilterOptions(){
		this.noMoreFilterOptions();
	    this.listData();
	}
	
	// Do not override!
	getLogged(): any{
		return this.crudService.getStorageService().getAuthUser();
	}
	
	// Do not override!
	private getParameterNamesForFilter(){
		if(this.emptyString(this.parameterName)){
			return null;
		}
		if(this.parameterName.indexOf('/') != -1){
		    return this.parameterName.trim().split('/');
	    }
	    return [this.parameterName.trim()];
	}
	
	// Do not override!
	onSearchFormSubmit(){
	    if(this.canceling){
		    this.canceling = false;
		    return;
	    }
	    var parameters = this.searchForm.value;
	    var parameterValue = parameters.parameterValue;
	    var names = this.getParameterNamesForFilter();
	    this.conditions = null;
	    if(this.emptyString(parameterValue) || this.emptyArray(names)){
		    this.listData();
		    return;
	    }
	    this.resetPagination();
	    this.conditions = '';
	    var size = names.length;
	    for(var i = 0; i < size; i++){
		    this.conditions += ((i==0) ? ' xoo (' : ' yoo ');
		    this.conditions += names[i].trim();
		    if(this.parameterOperator == '_%'){
			    this.conditions += ' xstrike quaspa' + parameterValue + '%quaspa ';
		    }
		    if(this.parameterOperator == '%_'){
			    this.conditions += ' xstrike quaspa%' + parameterValue + 'quaspa ';
		    }
		    if(this.parameterOperator == '%%'){
			    this.conditions += ' xstrike quaspa%' + parameterValue + '%quaspa ' ;
		    }
		    if(this.parameterOperator == '=' && this.parameterType == 'string'){
			    this.conditions += ' xstrike quaspa' + parameterValue + 'quaspa ';
		    }
		    if(this.parameterOperator == '=' && this.parameterType != 'string'){
			    this.conditions += ' = ' + parameterValue + ' ';
		    }
		    if(i == (size - 1)){
			    this.conditions += ') ';
		    }
	    }
	    this.listData();
    }
	
	// Do not override!
	cancelData(){
		this.canceling = true;
	}
	
	// Do not override!
    clearForm() {
   	    this.processValidation = false;
   	    if(!this.emptyObject(this.dataForm)){
   	    	this.dataForm.reset();		  
   	    }
    }
    
    // Do not override!
    errorRequired(inputName){
        return this.errorRequiredForm(this.dataForm,inputName);
    }
    
    // Do not override!
    errorRequiredForm(dataForm,inputName){
        return (null!=dataForm.get(inputName).errors && dataForm.get(inputName).errors.required);
    }
    
    // Do not override!
    errorEmail(inputName){
        return this.errorEmailForm(this.dataForm,inputName);
    }
    
    // Do not override!
    errorEmailForm(dataForm,inputName){
        return (null!=dataForm.get(inputName).errors && dataForm.get(inputName).errors.email);
    }
    
    // Do not override!
	listDataNoCache(){
		this.crudService.invalidateCache();
        this.listData();
	}
    
	// Do not override!
	listData(){
		this.title = this.listTitle;
	    this.editing = false;
	    this.setSelectedObject(null);
	    this.idObjectEdit = null;
	    this.load();
	    this.clearMessages(null);
	}
	
	// Could be overrided, take care!
	listDataAfterUpdate(){
		this.listData();
	}
	
	// Do not override!
	auditList(){
		if(this.auditingExclusions){return;}
		this.selectedPage = 1;
		this.auditingExclusions = true;
		this.listDataNoCache();
	}
	
	// Do not override!
	normalList(){
		if(!this.auditingExclusions){return;}
		this.selectedPage = 1;
		this.auditingExclusions = false;
		this.listDataNoCache();
	}
	
	// Do not override!
	filterBySelect(position){
	    if(this.emptyArray(this.specialConditions)){
		    throw ('specialConditions is undefined. Define as: this.specialConditions = [<string>,<string>,...];');
	    }
	    if(position >= this.specialConditions.length){
		    throw ('position: ' + position + ' is out of range for this.specialConditions array.');
	    }
	    this.specialCondition = this.specialConditions[position];
	    if(this.emptyString(this.specialCondition)){
		    this.specialCondition = '';
	    }
	    this.setPage(1);
	    this.listData();
	}
	
	// Do not override!
	filterBySelect2(position){
	    if(this.emptyArray(this.specialConditions2)){
		    throw ('specialConditions2 is undefined. Define as: this.specialConditions2 = [<string>,<string>,...];');
	    }
	    if(position < 0 || position >= this.specialConditions2.length){
		    throw ('position: ' + position + ' is out of range for this.specialConditions2 array.');
	    }
	    this.specialCondition2 = this.specialConditions2[position];
	    if(this.emptyString(this.specialCondition2)){
		    this.specialCondition2 = '';
	    }
	    this.setPage(1);
	    this.listData();
	}
	
	// Do not override!
	filterBySelect3(position){
	    if(this.emptyArray(this.specialConditions3)){
		    throw ('specialConditions3 is undefined. Define as: this.specialConditions3 = [<string>,<string>,...];');
	    }
	    if(position < 0 || position >= this.specialConditions3.length){
		    throw ('position: ' + position + ' is out of range for this.specialConditions3 array.');
	    }
	    this.specialCondition3 = this.specialConditions3[position];
	    if(this.emptyString(this.specialCondition3)){
		    this.specialCondition3 = '';
	    }
	    this.setPage(1);
	    this.listData();
	}
	
	// Do not override!
	filterBySelect4(position){
	    if(this.emptyArray(this.specialConditions4)){
		    throw ('specialConditions4 is undefined. Define as: this.specialConditions4 = [<string>,<string>,...];');
	    }
	    if(position < 0 || position >= this.specialConditions4.length){
		    throw ('position: ' + position + ' is out of range for this.specialConditions4 array.');
	    }
	    this.specialCondition4 = this.specialConditions4[position];
	    if(this.emptyString(this.specialCondition4)){
		    this.specialCondition4 = '';
	    }
	    this.setPage(1);
	    this.listData();
	}
	
	// Could be overrided. Take care!
	getAdditionalConditions(): string{ 
		var additionalCondition = this.emptyString(this.specialCondition) ? '' : this.specialCondition;
		additionalCondition += this.emptyString(this.specialCondition2) ? '' : this.specialCondition2;
		additionalCondition += this.emptyString(this.specialCondition3) ? '' : this.specialCondition3;
		additionalCondition += this.emptyString(this.specialCondition4) ? '' : this.specialCondition4;
		return (this.auditingExclusions ? '0x{auditingExclusions}' : '') + ' ' + additionalCondition; 
	}
	
	private restOfWaitTiming(){
		return (this.blockRequestTime - (new Date().getTime() - this.lastRequest));
	}
	
	// Do not override!
	private load(){
	    if(null==this.crudService){
		    return;
	    }
		this.setProcessing(true);
		if(this.blockRequest){
			setTimeout(() => {this.load();},this.restOfWaitTiming());
			return;
		}
		const conditions = (this.emptyString(this.conditions) ? '' : this.conditions) + this.getAdditionalConditions();
	  	this.crudService.getAll(this.selectedPage,this.rowsPerPage,conditions)
			.then(objects => { 
				this.setRequested();
				this.objects = this.clearRowZeroObjectsValidated(objects);
				this.loadMaxRows();
				this.setProcessing(false);
			});
	}
	 
	// Do not override!
    loadMaxRows(){
		this.totalRows = this.rowsFromObjects(this.objects);
		if(this.objects.length > 0){
			this.objects[0].totalRows = this.totalRows;
			this.selectSearched();
		}
		super.makePaginator();
	}
	
	// Do not override!
	showObject(id,modalId){
	    if(this.modalOpen && !this.emptyObject(id)){
	    	return;
	    }
		if(this.emptyObject(id)){
			if(null!=this.detailModal){
				this.detailModal.close();
			}
			this.showing = false;
			this.detailModal = null;
			this.setSelectedObject(null);
			this.modalOpen = false;
			return;
		}
		if(!(typeof id === "number")) {
	    	modalId = id.modalId;
	    	id = id.id;
	    }
		this.setProcessing(true);
		if(this.blockRequest){
			setTimeout(() => {this.showObject(id,modalId);},this.restOfWaitTiming());
			return;
		}
		this.modalOpen = true;
		this.crudService.loadFromCache(id).then(object => {
		    this.setRequested();
		    this.setProcessing(false);
			if(!(this.processObjectAndValidationResult(object,true))){
				return;
			}
			object = this.makeSelectSearchedItemDestaked(object,'');
			this.setSelectedObject(object);	
			this.showing = true;
			this.modalTab = 0;
			this.detailModal = this.modalService.open(modalId,this.modalConfigs);
        });
	}
	
	// Do not override!
	onOpenModalForm(form: FormGroup){
		form.reset();
	    this.clearMessages(0);
	}
	 
	// Do not override!
	openMessage(title,msg){
		if(null!=this.messageEmitterService){
    		this.messageEmitterService.get('openMessage').emit({header: title, message: msg});
    		return;
    	}
		this.setInActivity();
		this.informationMessage = {header: title,content: msg};
	}
	
	// Do not override!
	setInActivity(){
		if(null!=this.crudService){
			this.crudService.setInActivity();
		}
	}
	
	// Could be overrided. Take care!
	addObject(){
		this.setInActivity();
		this.idObjectEdit = null;
	    this.clearForm();
	  	this.title = this.addTitle;
	    this.editing = true;
	    this.noMoreFilterOptions();
	    this.setObject(this.emptyNewObject);
	    this.clearMessages(null);
	}
	
	// Could be overrided. Take care!
	editObject(id){
		if(this.emptyObject(id) || !(id > 0)){
			return;
		}
		this.setInActivity();
		this.setProcessing(true);
		if(this.blockRequest){
			setTimeout(() => {this.editObject(id);},this.restOfWaitTiming());
			return;
		}
	  	this.idObjectEdit = id;
	    this.clearForm();
	    this.title = this.editTitle;
	    this.editing = true;
	    this.noMoreFilterOptions();
	    this.setTab(0);
	    this.crudService.load(id).then(object => {
	        this.setRequested();
	    	if(this.processObjectAndValidationResult(object,true)){
	    		object.totalRows = this.totalRows;
	    		this.crudService.replaceOnCache(object);
	    		this.setObject(object);
	    		this.setStatusCode(null);
			}		
	    	this.setProcessing(false);
        });
	}
	
	// Should be overrided and call 'super.setSelectedObject(object)'
	setSelectedObject(object){
		this.setInActivity();
		this.selectedObject = object;
	}
	// Should be overrided and call 'super.setObject(object)'
	setObject(object){
	    if(this.emptyObject(object) || this.emptyObject(object.id) || !(object.id > 0)){
	    	this.tab = 0;
	    }
	  	this.setSelectedObject(object);
	}
	
	// Do not override!
	deleteObject(id,modalId){
	    if(this.modalOpen){
	    	return;
	    }
	    if(!(typeof id === "number")) {
	    	modalId = id.modalId;
	    	id = id.id;
	    }
	    this.setProcessing(true);
		if(this.blockRequest){
			setTimeout(() => {this.deleteObject(id,modalId);},this.restOfWaitTiming());
			return;
		}
		this.modalOpen = true;
		this.crudService.loadFromCache(id).then(object => {
		    this.setRequested();
		    this.setProcessing(false);
			if(!(this.processObjectAndValidationResult(object,true)) || !this.preValidateToDelete(object)){
				return;
			}
			object = this.makeSelectSearchedItemDestaked(object,'');
			this.setSelectedObject(object);
			this.deleteModal = this.modalService.open(modalId,this.modalConfigs);
        });
	}
	
	// Do not override!
	confirmDeleteObject(id){
	    if(null!=this.deleteModal){
	    	this.deleteModal.close();
			this.deleteModal = null;
			this.setSelectedObject(null);
			this.modalOpen = false;
	    }
		if(this.canceling){
			this.canceling = false;
			return;
		}
		this.setProcessing(true);
		if(this.blockRequest){
			setTimeout(() => {this.confirmDeleteObject(id);},this.restOfWaitTiming());
			return;
		}
		if(this.auditingExclusions){
			this.crudService.trullyDrop(id).then(object => {
				if(this.processObjectAndValidationResult(object,true)){
					this.listDataNoCache();
					return;
				}
				this.setRequested();
				this.setProcessing(false);
			});
			return;
		}
		this.crudService.drop(id).then(object => {
			if(this.processObjectAndValidationResult(object,true)){
				this.listDataNoCache();
		        this.callbackAfterDelete(id);
		        return;
			}
			this.setRequested();
			this.setProcessing(false);
		});
	}
	
	// Do not override!
	unDeleteObject(id,modalId){
	    if(this.modalOpen){
	    	return;
	    }
	    if(!(typeof id === "number")) {
	    	modalId = id.modalId;
	    	id = id.id;
	    }
	    this.setProcessing(true);
		if(this.blockRequest){
			setTimeout(() => {this.unDeleteObject(id,modalId);},this.restOfWaitTiming());
			return;
		}
		this.modalOpen = true;
		this.crudService.loadFromCache(id).then(object => {
		    this.setRequested();
		    this.setProcessing(false);
			if(!(this.processObjectAndValidationResult(object,true))){
				return;
			}
			object = this.crudService.setAutoValues(object);
			object.ownerId = this.storageService.localStorageGetItem('_ownerId_' + this.getAppId());
			object._token = this.storageService.localStorageGetItem('_token_' + this.getAppId());
			this.setSelectedObject(object);
		    this.deleteModal = this.modalService.open(modalId,this.modalConfigs);
        });
	}
	
	// Do not override!
	confirmUnDeleteObject(id){
	    if(null!=this.deleteModal){
	    	this.deleteModal.close();
			this.deleteModal = null;
			this.setSelectedObject(null);
			this.modalOpen = false;
	    }
		if(this.canceling){
			this.canceling = false;
			return;
		}
		this.setProcessing(true);
		if(this.blockRequest){
			setTimeout(() => {this.confirmUnDeleteObject(id);},this.restOfWaitTiming());
			return;
		}
		this.crudService.unDrop(id).then(object => {
			if(this.processObjectAndValidationResult(object,true)){
				this.listDataNoCache();
				return;
			}
			this.setRequested();
			this.setProcessing(false);
		});
	}
	
	// Do not override!
	onObjectFormSubmit() {
		this.setInActivity();
		this.validationMessages = null;
		if(this.canceling){
			this.canceling = false;
			this.processValidation = false;
			this.setObject(!this.emptyObject(this.selectedObject) ? this.selectedObject : this.emptyNewObject);
			if(null!=this.formModal){
				this.formModal.close();
			}
			this.setProcessing(false);
			return;
		}
		this.processValidation = true;   
		if(!this.validateFormFields()){
			return;
		}
		var object = !this.emptyObject(this.dataForm) ? this.dataForm.value : {id: 0};
		if(!this.preValidateToSaveUpdate(object)){
			return;
		}
		this.setProcessing(true);
		object = this.prepareToSaveUpdate(object);
		object = this.crudService.setAutoValues(object);
		object.ownerId = this.storageService.localStorageGetItem('_ownerId_' + this.getAppId());
		object._token = this.storageService.localStorageGetItem('_token_' + this.getAppId());
		object.id = !this.emptyObject(this.idObjectEdit) ? this.idObjectEdit : (this.emptyObject(object.id) ? 0 : object.id);
		if(this.emptyObject(this.idObjectEdit)){
			this.saveObject(object);
			return;
		}
		this.updateObject(object);
	}
	
	private saveObject(object){
		if(this.blockRequest){
			setTimeout(() => {this.saveObject(object);},this.restOfWaitTiming());
			return;
		}
		this.crudService.create(object).then(object2 => {
		    this.setRequested();
			if(this.processObjectAndValidationResult(object2,true)){
			    if(null!=this.formModal){
		    	    this.formModal.close();
			    }
			    this.crudService.invalidateCache();
	            this.addObject();
	            this.callbackAfterCreate(object);
	            return;
			}
			object = null;
			this.setProcessing(false);
		});
	}
	
	private updateObject(object){
		if(this.blockRequest){
			setTimeout(() => {this.updateObject(object);},this.restOfWaitTiming());
			return;
		}
		this.crudService.update(this.idObjectEdit,object).then(object2 => {
			if(this.processObjectAndValidationResult(object2,true)){
				if(null!=this.formModal){
					this.formModal.close();
				}
				this.crudService.mergeAnotherInObjectAndReplaceOnCache(this.idObjectEdit,object);
				this.listDataAfterUpdate();
		        this.callbackAfterUpdate(object);
		        return;
			}
			object = null;
			this.setRequested();
			this.setProcessing(false);
		});
	}
	
	private setActive(id,activateMe){
		this.clearMessages(0);
		this.setProcessing(true);
		if(this.blockRequest){
			setTimeout(() => {this.setActive(id,activateMe);},this.restOfWaitTiming());
			return;
		}
		this.crudService.loadFromCache(id).then(obj => {
			if(!(this.processObjectAndValidationResult(obj,true))){
				this.setRequested();
				this.setProcessing(false);
				return;
			}
			var toUpdate = {
				     id: id,
				 active: activateMe,
				 _token: this.storageService.localStorageGetItem('_token_' + this.getAppId()),
				ownerId: this.storageService.localStorageGetItem('_ownerId_' + this.getAppId())
			};
			this.crudService.update(id,toUpdate).then(obj2 => {
				if(obj2.code != 201){
					this.processObjectAndValidationResult(obj2,true);
					this.setRequested();
					this.setProcessing(false);
					return;
				}
				this.setStatusCode((activateMe == 1 || activateMe == true) ? 2011 : 2010);
				obj.active = activateMe;
				obj = this.prepareData(obj);
				this.crudService.replaceOnCache(obj);
		        this.listData();
		        this.callbackAfterUpdate(obj);
			});
		});
	}
	  
	lock(id){
		this.setActive(id,false);
	}
	  
	unlock(id){
		this.setActive(id,true);
	}
	
	private setRequested(){
	    if(this.blockRequest){
	    	return;
	    }
		this.blockRequest = true;
		setTimeout(() => {this.blockRequest = false; this.lastRequest = 0;},this.blockRequestTime);
		this.lastRequest = new Date().getTime();
	}
	
	// Should be overrided
	getAppId(){
		throw('Method "getAppId()" should be overrided');
	}

	// Should be overrided to throw form validations, for show validation form messages.
	validateFormFields(): Boolean{
		throw ('validateFormFields(): Boolean not implemented! Should be overrided!');
	}
	
	// Should be overrided to realize validations before try save or update.
	preValidateToSaveUpdate(object): boolean{
		return true;
	}
	
	// Should be overrided to realize validations before try delete.
	preValidateToDelete(object): boolean{
		return true;
	}
	
	// Should be overrided to add tokens and other controlled data. Take care, dont call super()
	prepareToSaveUpdate(object){
		return object;
	}
	
	// Should be used in child class to do anything after sucess on create new object.
	callbackAfterCreate(object){
		this.setProcessing(false);
	}
	
	// Should be used in child class to do anything after sucess on update a existing object.
	callbackAfterUpdate(object){
		//this.setProcessing(false); 
	}
	
	// Should be used in child class to do anything after sucess on delete a existing object.
	callbackAfterDelete(id){
		this.setProcessing(false); 
	}
    
    // Should be overrided when need transform the data objects to show.
    prepareData(object){
    	return object;
    }
    
    // Do not override!
    selectSearched(){
        const size = this.objects.length;
        for(var i = 0; i < size; i++){
  		    this.objects[i] =  this.prepareData(this.objects[i]);
  	    }
        var destak = this.searchForm.value.parameterValue;
        if(this.emptyObject(destak)){
    	    return;
        }
        destak = destak.trim();
        if(destak != ''){
    	    destak = destak.toUpperCase();
        }
	    for(var i = 0; i < size; i++){
		    this.objects[i] = this.makeSelectSearchedItemDestaked(this.objects[i],destak);
	    }
    }
    
    // Should be overrided/implemented! Used in list results filter
    makeSelectSearchedItemDestaked(object,destakSearch): Object{
    	throw('makeSelectSearchedItemDestaked(object,destakSearch) not implemented! Should be overrided!');
    }
    
    // Do not override!
    makeDestak(text,destak){
        if(this.emptyObject(text) || this.stringServicee.trimm(text) == ''){
    	    return '';
        }
  	    text = text.replace(/<.+?>/gi,'');
        if(destak == ''){
        	return text;
        }
        var newText = '';
        var di = '<span class="destak" aria-label="um trecho que casa com o termo pesquisado">';
        var df = '</span>';
        var idx = text.toUpperCase().indexOf(destak);
  	    while(idx != -1){
  		    var idx2 = idx + destak.length;
  		    newText += text.substring(0,idx);
  		    newText += di;
  		    newText += text.substring(idx, idx2);
  		    newText += df;
  		    text = text.substring(idx2, text.length);
  		    idx = text.toUpperCase().indexOf(destak);
  	    }
  	    return newText + text;
    }
    
    // Should be called in child's ngOnDestroy() as super.ngOnDestroy();
    ngOnDestroy(){
		this.canceling = null;
		this.dataForm = null;
		this.searchForm = null;
		this.parameterName = null;
		this.parameterType = null;
		this.parameterOperator = null;
		this.conditions = null;
		this.crudService = null;
		this.modalService = null;
		this.objects = null;
		this.selectedObject = null;
		this.title = null;
		this.listTitle = null;
		this.addTitle = null;
		this.editTitle = null;
		this.editing = null;
		this.showing = null;
		this.auditingExclusions = null;
		this.emptyNewObject = null;
		this.idObjectEdit = null;
		this.detailModal = null;
		this.deleteModal = null;
		this.formModal = null;
		this.modalOpen = null;
		this.informationMessage = null;
		this.deletedAt = null; 
		this.viewTitleSeparator = null;
		this.urlBase = null;
		this.lastRequest = null;
	    this.blockRequest = null;
	    this.blockRequestTime = null;
		this.moreFilters = null;
		this.selectOptionsLabel = null;
	    this.selectOptionsValues = null;
		this.specialCondition = null;
		this.specialConditions = null;
		this.selectOptionsLabel2 = null;
	    this.selectOptionsValues2 = null;
		this.specialCondition2 = null;
		this.specialConditions2 = null;
		this.selectOptionsLabel3 = null;
	    this.selectOptionsValues3 = null;
		this.specialCondition3 = null;
		this.specialConditions3 = null;
		this.selectOptionsLabel4 = null;
	    this.selectOptionsValues4 = null;
		this.specialCondition4 = null;
		this.specialConditions4 = null;
		super.ngOnDestroy();
	}
	
}