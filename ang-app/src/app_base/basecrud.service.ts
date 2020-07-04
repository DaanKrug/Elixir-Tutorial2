import { Meta } from '@angular/platform-browser';
import { HttpHeaders, HttpClient } from '@angular/common/http';

import { StorageService } from './storage/storage.service';
import { ValidationResult } from './validation/validation.result';
import { CacheDataService } from './cache/cache.data.service';

export class BaseCrudService {
	
    options: any;
	storageService: StorageService;
    cacheDataService: CacheDataService;
    replaceOnCacheOnLoadById: boolean;
    meta: Meta;
	
	constructor(protected http: HttpClient) {
		this.ngOnInit();
	}
	
	// Do not override!
	setMeta(meta: Meta){
		this.meta = meta;
		this.setHeaders();
	}
	
	// Do not override!
	getAppId(){
		return this.meta.getTag('name=app-id').content;
	}
	
	private setHeaders(){
	    var headersHttp = new HttpHeaders({ 
	         'X-CSRF-TOKEN': this.storageService.localStorageGetItem('_token_' + this.getAppId()),
			 'Content-Type': 'application/json', 
			 'Access-Control-Allow-Origin': '*'
		});
		this.options = { headers: headersHttp };
	}
	
	private jsonReplacer(key, value) {
	    if(typeof value === "boolean") {
	        return ((undefined == value || null==value || (('' + value) == '')) ? 0 :  (value ? 1 : 0));
	    }
	    return value;
	}
	
	// Do not override!
	protected stringify(object){
		return JSON.stringify(object,this.jsonReplacer);
	}
	
	ngOnInit(){
		this.replaceOnCacheOnLoadById = true;
	}
	ngOnDestroy(){
		this.storageService = null;
		this.cacheDataService = null;
		this.replaceOnCacheOnLoadById = null;
		this.options = null;
		this.meta = null;
	}
	
	setStorageService(storageService: StorageService){
		this.storageService = storageService;
	}
	
	getStorageService(){
		return this.storageService;
	}
	
	setCacheDataService(cacheDataService: CacheDataService){
		this.cacheDataService = cacheDataService;
	}
	
	replaceOnCache(object){
		if(null!=this.cacheDataService){
			this.cacheDataService.replaceOnCache(this.getUrlForCache(),object);
		}
	}
	
	invalidateCache(){
		if(null!=this.cacheDataService){
			this.cacheDataService.invalidateAll(this.getUrlForCache());
		}
	}
	
	getChangedValue(changed,oldValue){
		return (undefined!=changed && null!=changed) ? changed : oldValue;
	}
	
	getUrl(){return null;}
	getUrlForCache(){return this.getUrl();}
	
	getObjectFromCache(id){
		return this.cacheDataService.getObjectFromCache(this.getUrlForCache(), id);
	}
	
	mergeAnotherInObject(objectInCache,anotherObject){
		throw ('mergeAnotherInObject(object,anotherObject) not implemented! Should be overrided!');
	}
	
	mergeAnotherInObjectAndReplaceOnCache(id,anotherObject){
		var objectInCache = this.getObjectFromCache(id);
		if(null==objectInCache){
			this.invalidateCache();
			return;
		}
		objectInCache = this.mergeAnotherInObject(objectInCache,anotherObject);
		if(undefined==objectInCache || null==objectInCache){
			throw('mergeAnotherInObject(objectInCache,anotherObject) should return a valid object!');
		}
		if(undefined==objectInCache.id || null==objectInCache.id || !(objectInCache.id > 0)){
			var err = 'mergeAnotherInObject(objectInCache,anotherObject)';
			err += ' should return a valid object whit a id > 0!';
			throw(err);
		}
		this.replaceOnCache(objectInCache);
	}
	
	getEmptyObject(conds) :Object{
		throw ('getEmptyObject(conditions) not implemented! Should be overrided!');
	}
	
	//Could be overrided to set attribute values from localStorage
	setAutoValues(object){
		return object;
	}
	
	getBase(){
		return this.storageService.localStorageGetItem('_doc_base_' + this.getAppId());
	}
	
	getAntiCache(){
	    return '?v=' + new Date().getTime();
    }
	
	setInActivity(){
		this.storageService.localStorageSetItem('_lastActivity_' + this.getAppId(), '' + (new Date().getTime()),false);
	}
	
	private getAllNoCache(page,rows,object): Promise<any[]> {
		return this.http.post(
				  this.getUrl() + '/' + page + '/' + rows + this.getAntiCache(),
	              this.stringify(object),
	              this.options
	            )
				.toPromise().then((response: any) => {
					if(null!=this.cacheDataService){
						this.cacheDataService.addToCache(this.getUrlForCache(), object.conditions, page, rows, response);
					}
					return response;
				})
				.catch(this.handleError);
	}
	
	getAll(page,rows,object): Promise<any[]> {
		this.setInActivity();
		if(null!=this.cacheDataService){
			var cacheData = this.cacheDataService.getFromCache(this.getUrlForCache(), object.conditions, page, rows);
			if(null!=cacheData){
     		   return Promise.resolve(cacheData);
     	    }
     	    return this.getAllNoCache(page,rows,object);
		}
		return this.getAllNoCache(page,rows,object);
	}
	
	load(id): Promise<any> {
		this.setInActivity();
	    return this.http.post(
	    		this.getUrl() + '/' + id + this.getAntiCache(),
	    		this.stringify(this.getEmptyObject(null)),
	    		this.options
	       )
	      .toPromise()
	      .then((response: any) => {
	    	  if(this.replaceOnCacheOnLoadById){
	    		  this.replaceOnCache(response);
	    	  }
	    	  return response;
	      })
	      .catch(this.handleError);
	}
	
	loadFromCache(id): Promise<any> {
		this.setInActivity();
		if(null!=this.cacheDataService){
			var object = this.getObjectFromCache(id);
			if(null!=object){
     		   return Promise.resolve(object);
     	    }
			return this.load(id);
		}
		return this.load(id);
	}
	
	loadByObject(object: Object, patch: boolean): Promise<any> {
		this.setInActivity();
		if(patch){
			return this.http.patch(this.getUrl() + this.getAntiCache(),this.stringify(object),this.options)
					     .toPromise()
					     .then((response: any) => {return response;})
					     .catch(this.handleError);
		}
	    return this.http.put(this.getUrl() + this.getAntiCache(),this.stringify(object),this.options)
				     .toPromise()
				     .then((response: any) => {return response;})
				     .catch(this.handleError);
	}
	
	create(object: Object): Promise<any>{
		this.setInActivity();
	    return this.http.post(this.getUrl() + this.getAntiCache(),this.stringify(object),this.options)
				    .toPromise()
			        .then((response: any) => {return response;})
			        .catch(this.handleError);
	}
	  
	update(id,object: Object): Promise<any>{
		this.setInActivity();
	    return this.http.put(this.getUrl() + '/' + id + this.getAntiCache(),this.stringify(object),this.options)
				    .toPromise()
			        .then((response: any) => {return response;})
			        .catch(this.handleError);
	}
	  
	drop(id): Promise<any>{
		this.setInActivity();
	    return this.http.patch(this.getUrl() + '/' + id,this.stringify(this.getEmptyObject(null)),this.options)
				    .toPromise()
			        .then((response: any) => {return response;})
			        .catch(this.handleError);
	}
	
	unDrop(id): Promise<ValidationResult>{
		this.setInActivity();
		const url = this.getUrl() + '/unDrop/' + id + this.getAntiCache();
	    return this.http.patch(url,this.stringify(this.getEmptyObject(null)),this.options)
	                     .toPromise()
	                     .then((response: any) => {return response;})
	                     .catch(this.handleError);
	}
	
	trullyDrop(id): Promise<ValidationResult>{
		this.setInActivity();
		const url = this.getUrl() + '/trullyDrop/' + id + this.getAntiCache();
	    return this.http.patch(url,this.stringify(this.getEmptyObject(null)),this.options)
	                     .toPromise()
	                     .then((response: any) => {return response;})
	                     .catch(this.handleError);
	}
	
	handleError(error: any): Promise<any> {
	    console.error('An error occurred', error);
	    const appError = {
	    	objectClass: 'AppError',
	    	code: 500,
	    	msg: '' + error.message
	    };
	    return Promise.resolve(appError);
	} 
	
}