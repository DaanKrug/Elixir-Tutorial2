import { NgxSpinnerService } from 'ngx-spinner';
import { StringService } from './string/string.service';
import { EventEmitterService } from './event/event.emitter.service';
import { StorageService } from './storage/storage.service';

export class BaseComponent{

	storageService: StorageService
	selectedPage: number;
	rowsPerPage: number;
	totalRows: number;
	totalPages: number;
	pages: number[];
	pageRange: number;
	minPage: number;
	maxPage: number;
	nextPageDisabled: boolean;
	previousPageDisabled: boolean;
	statusCode: number;
	requestProcessing: boolean;
	processValidation: boolean;
    stringServicee: StringService;
	validationMessages: string[];
	statusMessages: any[];
	sucessErrorMessages: any;
	spinner: NgxSpinnerService;
	startSpinner: number;
	clearMessagesTimeout: any;
    nameToFilter: string;
	tProcessing:any;

    tab: number;
    listTab: number;
    modalTab: number;
    fileTypes: string[];
    messageEmitterService: EventEmitterService;
    formInfo: string[];
    modalConfigs: Object;
    captchaOk: boolean;

	// Can be overrided. Take care.
	ngOnInit() {
	    this.requestProcessing = false;
	    this.processValidation = false;
	    this.resetPagination();
	    this.fileTypes = ['image/png','image/jpeg','image/jpeg','image/gif','image/bmp',
	         'application/pdf',
	         'application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	         'application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
	         'application/vnd.ms-powerpoint','application/vnd.openxmlformats-officedocument.presentationml.presentation'];
	    this.tab = 0;
	    this.listTab = 0;
	    this.modalTab = 0;
	    this.modalConfigs = { ariaLabelledBy: 'modal-basic-title', 
	                          size: 'lg', 
						      backdrop: 'static', 
						      keyboard: false, 
						      centered: true
						    };
	}
	
	// Do not override!
	getSucessCodesForMessages(){
		return [200,201,202,203,204,205,206,207,208,209,210,211,213,214,215,216];
	}
  
	// Do not override!
	trackById(index, item) {
        return item.id;
    }
	
	//Do not override!
	setTab(tab){
		this.tab = tab;
	}
	
	//Do not override!
	setCaptchaOk(captchaOk){
  	    this.captchaOk = captchaOk;
    }
	
	//Do not override!
	setListTab(tab){
		this.listTab = tab;
	}
	
	//Do not override!
	setModalTab(tab){
		this.modalTab = tab;
	}
		
	// Do not override!
	onDateSelect(event,target){
		var date = event;
		var d = date.day;
		var m = date.month;
		var y = date.year;
		this.patchValue(target,(((d > 9) ? '' : '0') + d + '/' + ((m > 9) ? '' : '0') + m + '/' + y + ' 00:00:00'));
	}
	
	onDateSelectReport(event,target){
		var date = event;
		var d = date.day;
		var m = date.month;
		var y = date.year;
		this.patchValueReport(target,(((d > 9) ? '' : '0') + d + '/' + ((m > 9) ? '' : '0') + m + '/' + y + ' 00:00:00'));
	}
	
	patchValueReport(target,value){
		throw ('patchValueReport(target,value) should be overrided!');
	}
	
	// Do not override!
	cloneName(name,maxLength){
		var newName = name + '-cl-' + new Date().getTime();
		if(newName.length > maxLength){
			newName = newName.substring(newName.length - maxLength);
		}
		return newName;
	}
	
	// Do not override!
	validateFile(fileData, size){
		if(null==size || size < 0){
			size = 1;
		}
		if(size > 10){
			size = 10;
		}
		if(fileData.size > (size * 1048576)){
			this.addValidationMessage('Arquivo maior que ' + size + ' MB!');
		}
		if(!(this.fileTypes.includes(fileData.type))){
			this.addValidationMessage('Tipo do Arquivo não aceito.');
		}
		return !this.inValidationMsgs();
	}
	
	// Do not override!
	validateFileType(filename,desiredType){
		var type = this.getTypeOfFile(filename);
		return (type == desiredType);
	}
	
	// Do not override!
	getTypeOfFile(filename){
		if(filename.indexOf('.') == -1){
			return null;
		}
		var ext = filename.substring(filename.lastIndexOf('.') + 1);
		if(['png','jpg','jpeg','bmp','gif'].includes(ext)){
			return 'image';
		}
		if('pdf' == ext){
			return 'pdf';
		}
		if(['doc','docx'].includes(ext)){
			return 'word';
		}
		if(['xls','xlsx'].includes(ext)){
			return 'excel';
		}
		if(['ppt','pptx'].includes(ext)){
			return 'powerpoint';
		}
		return null;
	}
	
	// Do not override!
	getMymeTypeOfFile(filename){
		if(filename.indexOf('.') == -1){
			return '';
		}
		var ext = filename.substring(filename.lastIndexOf('.') + 1);
		if(['png','jpg','jpeg','bmp','gif'].includes(ext)){
			return 'image/' + ext;
		}
		if('pdf' == ext){
			return this.fileTypes[5];
		}
		if('doc' == ext){
			return this.fileTypes[6];
		}
		if('docx' == ext){
			return this.fileTypes[7];
		}
		if('xls' == ext){
			return this.fileTypes[8];
		}
		if('xlsx' == ext){
			return this.fileTypes[9];
		}
		if('ppt' == ext){
			return this.fileTypes[10];
		}
		if('pptx' == ext){
			return this.fileTypes[11];
		}
		return '';
	}
	
	// Do not override!
	private getMimeByHexHeader(mimetype,hexHeader){
		if(['89504e47'].includes(hexHeader)){
			return 'image/png';
		}
		if(['ffd8ffe0','ffd8ffe1','ffd8ffe2','ffd8ffe3','ffd8ffe8'].includes(hexHeader)){
			return 'image/jpeg';
		}
		if(['47494638'].includes(hexHeader)){
			return 'image/gif';
		}
		if(hexHeader.indexOf('424d') == 0){
			return 'image/bmp';
		}
		if(['25504446'].includes(hexHeader)){
			return 'application/pdf';
		}
		if(['d0cf11e0'].includes(hexHeader) && mimetype == 'application/msword'){
			return mimetype;
		}
		if(['d0cf11e0'].includes(hexHeader) && mimetype == 'application/vnd.ms-excel'){
			return mimetype;
		}
		if(['d0cf11e0'].includes(hexHeader) && mimetype == 'application/vnd.ms-powerpoint'){
			return mimetype;
		}
		if(['504b0304','504b0506','504b0708'].includes(hexHeader) 
		   && mimetype == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'){
			return mimetype;
		}
		if(['504b0304','504b0506','504b0708'].includes(hexHeader) 
		   && mimetype == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
			return mimetype;
		}
		if(['504b0304','504b0506','504b0708'].includes(hexHeader) 
		   && mimetype == 'application/vnd.openxmlformats-officedocument.presentationml.presentation'){
			return mimetype;
		}
		return null;
	}
	
	validateFileContentBase64(mimetype,arrayBuffer){
        var arr = (new Uint8Array(arrayBuffer)).subarray(0,4);
        var size = arr.length;
	    var hexHeader = '';
	    for(var i = 0; i < size; i++) {
	    	hexHeader += arr[i].toString(16);
	    }
	    return (mimetype == this.getMimeByHexHeader(mimetype,hexHeader.toLowerCase()));
    }
	
	// Do not override!
	zeroOnNulls(arr){
		if(this.emptyArray(arr)){
			return [];
		}
		const size = arr.length;
		for(var i =  0; i < size; i++){
			if(this.emptyObject(arr[i])){
				arr[i] = 0;
			}
		}
		return arr;
	}
	
	// Do not override!
	rowsFromObjects(objects: any){
		if(this.emptyArray(objects) || this.emptyObject(objects[0])){
			return 0;
		}
		return objects[0].totalRows;
	}
	
	// Do not override!
	clearRowZeroObjects(objects: any){
		if(this.rowsFromObjects(objects) == 0){
			return [];
		}
		return objects;
	}
	
	// Do not override!
	clearRowZeroObjectsValidated(objects){
		objects = this.clearRowZeroObjects(objects);
		if(objects.length > 0 && !(this.processObjectAndValidationResult(objects[0],true))){
			return [];
		}
		return objects;
	}
	
	// Do not override!
	getFromArrayById(objects,id,defaultOpt){
		if(this.emptyObject(objects) || this.emptyObject(id)){
			return defaultOpt;
		}
		const size = objects.length;
		for(var i = 0; i < size; i++){
		    if(objects[i].id == id){
			    return objects[i];
		    }
		}
		return defaultOpt;
	}
	
	// Do not override!
	preFilterByName(name){
		if(this.emptyObject(name) || name.trim() == this.nameToFilter){
			return false;
		}
		this.nameToFilter = this.stringServicee.scapeInvalidCharsFromInputText(name.trim());
		this.setProcessing(true);
		return true;
	}
	
	// Do not override!
	addOnFirst(arr: any[], object: any){
		if(this.emptyObject(arr)){
			arr = [];
		}
		if(this.emptyObject(object) || this.emptyObject(object.id)){
			return arr;
		}
		var finded = false;
		const size = arr.length;
		for(var i = 0; i < size; i++){
			if(this.emptyObject(arr[i]) || this.emptyObject(arr[i].id)){
				continue;
			}
			if(arr[i].id == object.id){
				finded = true;
				break;
			}
		}
		if(!finded){
			arr = [object,...arr];
		}
		return arr;
	}
	
	// Do not override!
	removeFromArray(arr,value){
	    if(this.emptyObject(arr)){
	    	return [];
	    }
		var arrNew = [];
        var size = arr.length;
        for(var i = 0; i < size; i++){
            if(arr[i] != value){
                arrNew.unshift(arr[i]);
            }
        }
        return arrNew;
	}
	
	emptyObject(value){
		return (undefined==value || null==value);
	}
	
	emptyArray(value){
	    if(this.emptyObject(value)){
	    	return true;
	    }
		return (null!=value && value.length == 0);
	}
	
	emptyString(value){
	    if(this.emptyObject(value)){
	    	return true;
	    }
		return (null!=value && value.trim() == '');
	}
	
	private cannotTransform(value){
	    if(this.emptyString(value)){
	    	return true;
	    }
		return (null==this.stringServicee);
	}
	
	private truncateAndPatch(target,value,maxLength){
		if(!this.emptyObject(maxLength) && maxLength > 0 && value.length > maxLength){
			value = value.substring(0,maxLength);
		}
		this.patchValue(target,value);
	}
	
	// Do not override!
	getLabelForKey(objects,key){
	    if(this.emptyArray(objects) || this.emptyObject(key)){
	    	return '';
	    }
		var size = objects.length;
		for(var i = 0; i < size; i++){
			if(!this.emptyObject(objects[i]) && !this.emptyObject(objects[i].value) 
			   && ('' + objects[i].value) == ('' + key)){
				return  ('' + objects[i].label);
			}
		}
		return '';
	}
	
	// Do not override!
	adjustInputTextMailAddressValueAfterChange(target,value){
		if(this.cannotTransform(value)){
			return;
		}
		value = this.stringServicee.replaceAll(value.trim(),'\n',',');
		value = this.stringServicee.replaceAll(value,' ',',');
		value = this.stringServicee.replaceAll(value,';',',');
		value = this.stringServicee.replaceAll(value,',,',',');
		this.adjustInputTextValueAfterChange(target,value,null);
	}
	
	// Do not override!
	adjustInputTextValueAfterChange(target,value,maxLength){
		if(this.cannotTransform(value)){
			return;
		}
		this.truncateAndPatch(target,this.stringServicee.scapeInvalidCharsFromInputText(value),maxLength);
	}
	
	// Do not override!
	adjustInputAlphaNameValueAfterChange(target,value,maxLength){
		if(this.cannotTransform(value)){
			return;
		}
		this.truncateAndPatch(target,this.stringServicee.scapeInvalidCharsFromInputAlpha(value),maxLength);
	}
	
	// Do not override!
	adjustInputAlphaNumNameValueAfterChange(target,value,maxLength){
		if(this.cannotTransform(value)){
			return;
		}
		this.truncateAndPatch(target,this.stringServicee.scapeInvalidCharsFromInputAlphaNum(value),maxLength);
	}
	
	// Do not override!
	adjustInputNumberValueAfterChange(target,value,maxLength,min,max){
		if(this.cannotTransform(value)){
			return;
		}
		var value2 = this.stringServicee.scapeInvalidCharsFromInputNumber(value.trim());
		if(undefined!=maxLength && null!=maxLength && maxLength > 0 && value2.length > maxLength){
			value2 = value2.substring(0,maxLength);
			value2 = this.stringServicee.scapeInvalidCharsFromInputNumber(value2);
		}
		if(!(this.stringServicee.numberGreaterEqual(value2,min))){
			value2 = '' + min;
		}
		if(!(this.stringServicee.numberSmallerEqual(value2,max))){
			value2 = '' + max;
		}
		this.patchValue(target,value2);
	}
	
	// Do not override!
	capitalize(value) {
		return this.stringServicee.capitalize(value);
    }
	
	// Should be overrided to provide a mode to change dynamically the value of inputs.
	patchValue(target,value){}
	
	// Do not override!
	preProcessConfigurations() {
        this.setStatusCode(null);
        this.setProcessing(true);   
    }
	
	// Do not override!
	setProcessing(requestProcessing: boolean){
		if(this.requestProcessing == requestProcessing){
			return;
		}
		this.requestProcessing = requestProcessing;   
		if(this.requestProcessing){
			if(null==this.startSpinner){
				this.startSpinner = new Date().getTime();
			}
			this.showLoadingMask();
			var thisThis = this;
			this.tProcessing = setInterval(()=>{
				thisThis.setInActivity();
			},10000);
			return;
		}
		if(null!=this.tProcessing){
			clearInterval(this.tProcessing);
			this.tProcessing = null;
		}
		this.hideLoadingMask();
	}
	
	// Should be overrided!
	setInActivity(){}
	
	// Do not override!
	showLoadingMask(){
		if(this.emptyObject(this.spinner)){return; }
		this.spinner.show();
	}
	
	// Do not override!
    hideLoadingMask(){
    	if(this.emptyObject(this.spinner)){ return; }
    	const d = new Date();
    	const tv = d.getTime() - this.startSpinner;
    	if(tv > 400){
    		this.closeSpinner();
    		return;
    	}
    	var thisThis = this;
    	setTimeout(()=>{thisThis.closeSpinner();},(550 - tv));
	}
    
    private closeSpinner(){
    	if(this.emptyObject(this.spinner)){ return; }
    	this.spinner.hide();
		this.startSpinner = null;
    }
    
    // Do not override!
    makePaginator(){
		  this.totalPages = Math.floor(this.totalRows/this.rowsPerPage)
		  				  + (((this.totalRows%this.rowsPerPage) != 0) ? 1 : 0);
		  this.pages = [];
		  var pos = 0;
		  var idxCtrl = 0;
		  for(var i = 0; i < this.totalPages; i++){
			  if((i + 1) < this.minPage || (i + 1) > this.maxPage){
				  continue;
			  }
			  idxCtrl = i + 1;
			  this.pages[pos] = idxCtrl;
			  pos ++;
		  }
		  this.nextPageDisabled = false;
		  this.previousPageDisabled = false;
		  if(this.minPage == 1){
			  this.previousPageDisabled = true;
		  }
		  if(idxCtrl == this.totalPages){
			  this.nextPageDisabled = true;
		  }
	}
	
    // Do not override!
	previousPage(){
		  var newPage = this.minPage - this.pageRange;
		  if(newPage > 0){
			  this.selectedPage -= this.pageRange;
			  this.minPage = newPage;
			  this.maxPage = this.minPage + this.pageRange - 1;
			  this.listData();
			  return;
		  }
		  this.selectedPage = 1;
		  this.minPage = 1;
		  this.maxPage = this.pageRange;
		  this.listData();
	}
	
	// Do not override!
	nextPage(){
		  var newPage = this.maxPage + this.pageRange;
		  if(newPage < this.totalPages){
			  this.selectedPage += this.pageRange;
			  this.minPage = this.minPage + this.pageRange;
			  this.maxPage = newPage;
			  this.listData();
			  return;
		  }
		  newPage = this.totalPages;
		  var diff = ((this.maxPage + this.pageRange) - this.totalPages);
		  this.selectedPage += this.pageRange - diff;
		  this.minPage = this.minPage + this.pageRange - diff;
		  this.maxPage = newPage;
		  this.listData();
	}
	
	// Do not override!
	setPage(page){
		  if(this.selectedPage == page){
			  return;
		  }
		  this.selectedPage = page;
		  this.listData();
	}  
	
	// Should be overrided!
	listDataNoCache(){
		throw ('listDataNoCache() should be overrided!');
	}
	
	// Should be overrided!
	listData(){
		throw ('listData() should be overrided!');
	}
	
	// Do not override!
	resetPagination(){
		this.selectedPage = 1;
	    this.rowsPerPage = 5;
	    this.pageRange = 15;
	    this.minPage = 1;
	    this.maxPage = 15;
	}
	
	// Do not override!
	private addStatusOrValidationMsg(code: number,msg: string,statusMessage: boolean){
		if(code == 205){
			return;
		}
		var msgg = '';
		if((code == 200 || code == 206) && !this.emptyString(msg)){
			msgg = msg;
		}
		if(msgg == '' && this.getSucessCodesForMessages().includes(code)){
			msgg = this.sucessErrorMessages[code];
		}
		if(msgg == ''){
			msgg = (statusMessage ? ('<strong>[' + code + ']:</strong>') : '') + msg;
		}
		if(statusMessage){
		    this.addValidationStatusMessage(code,msgg);
		    return;
	    }
		this.addValidationMessage(msgg);
	}
	
	// Do not override!
	addValidationMessage(msg){
		if(null==this.validationMessages){
			this.validationMessages = [];
		}
		this.validationMessages = [...this.validationMessages, msg];
	}
	
	// Do not override!
	inValidationMsgs(){
		if(this.emptyObject(this.validationMessages)){
			return false;
		}
		return (this.validationMessages.length > 0);
	}
	
	// Do not override!
	processObjectAndValidationResult(validation: any,statusMessage: boolean): boolean{
		if(!this.emptyObject(validation) && this.emptyString(validation.objectClass)){
			return true;
		}
		this.clearMessages(3000);
		if(this.emptyObject(validation)){
			this.addStatusOrValidationMsg(500,null,statusMessage);
			return false;
		}
		if(validation.objectClass != 'ValidationResult'){
			if(validation.objectClass == 'DBConnectionFail'){
				validation.msg = 'Erro de conexão ao banco de dados.';
			}
			if(validation.objectClass == 'SqlSyntaxError'){
				validation.msg = 'Erro ao processar consulta.';
			}
			if(validation.objectClass == 'OperationError'){
				validation.msg = !this.emptyString(validation.msg) ? validation.msg : 'Erro ao processar solicitação.';
			}
			if(validation.objectClass == 'AppError'){
				validation.msg = 'Erro da aplicação.';
			}
		}
		this.addStatusOrValidationMsg(validation.code,validation.msg,statusMessage);
		return this.getSucessCodesForMessages().includes(validation.code);
	}
	
	// Do not override!
    setStatusCode(statusCode){
    	this.statusCode = statusCode;
    	this.setStatusCodeMessage(this.statusCode);
    }
    
    // Do not override!
    private getTyppClazzMsg(statusCode: number){
    	var typp = 'warning';
    	var clazz = 'fas fa-exclamation';
    	if((statusCode >= 200 && statusCode <= 300) || (statusCode >= 2000 && statusCode <= 3000)){
    		typp = 'success';
      	    clazz = 'fas fa-check';
    	}
    	if((statusCode >= 500 && statusCode <= 600) || (statusCode >= 5000 && statusCode <= 6000)){
    		typp = 'danger';
    	    clazz = 'fas fa-times';
  	    }
    	return[typp,clazz];
    }
    
    // Do not override!
    private setStatusCodeMessage(statusCode){
  	    this.statusMessages = [];
  	    if(this.emptyObject(statusCode) || !(statusCode > 0)){
  		    return;
  	    }
  	    var msg = this.sucessErrorMessages[statusCode];
	    if(this.emptyString(msg)){
	    	return;
	    }
	    this.addValidationStatusMessage(statusCode,msg);
    }
    
    // Do not override!
    addValidationStatusMessage(statusCode,msg){
    	if(null!=this.messageEmitterService){
    		this.messageEmitterService.get('addValidationStatusMessage').emit({code: statusCode, message: msg});
    		return;
    	}
    	if(this.emptyObject(this.statusMessages)){
    		this.statusMessages = [];
    	}
    	const tc = this.getTyppClazzMsg(statusCode);
    	const msgValidation = { type: tc[0], clazz: tc[1], msgg: msg};
    	this.statusMessages = [...this.statusMessages,msgValidation];
    }
  
    // Do not override!
    clearMessages(timeout){
    	if(null!=this.messageEmitterService){
    		this.messageEmitterService.get('clearMessages').emit({time: timeout});
    		return;
    	}
        if(null!=this.clearMessagesTimeout){
  		    clearInterval(this.clearMessagesTimeout);
  		    this.clearMessagesTimeout = null;
  	    }
        var timeClear = ((!this.emptyObject(timeout) && timeout > 0) ? timeout : 2000);
        if(this.requestProcessing){
    	    timeClear += 2000;
        }
	    var thisThis = this;
	    this.clearMessagesTimeout = setTimeout(()=>{ thisThis.setStatusCode(null); },timeClear);
    }
	
    // Should be called in child's ngOnDestroy() as super.ngOnDestroy();
    ngOnDestroy(){
        this.storageService = null;
		this.selectedPage = null;
		this.rowsPerPage = null;
		this.totalRows = null;
		this.totalPages = null;
		this.pages = null;
		this.pageRange = null;
		this.minPage = null;
		this.maxPage = null;
		this.nextPageDisabled = null;
		this.previousPageDisabled = null;
		this.statusCode = null;
		this.requestProcessing = null;
		this.processValidation = null;
		this.stringServicee = null;
		this.validationMessages = null;
		this.statusMessages = null;
		this.sucessErrorMessages = null;
		this.spinner = null;
		clearInterval(this.clearMessagesTimeout);
		this.clearMessagesTimeout = null;
		this.tab = null;
		this.listTab = null;
		this.modalTab = null;
		this.nameToFilter = null;
		this.fileTypes = null;
		this.formInfo = null;
		this.modalConfigs = null;
		this.captchaOk = null;
	}
	
}