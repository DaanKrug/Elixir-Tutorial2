import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class StorageService {
	
	logged: Object;
	store: any[];
	localStorageKeys: string[];
	
	clear(){
		this.store = [];
	}

	put(object: Object){
		if(null==object){
			return;
		}
		if(null==this.store){
			this.clear();
		}
		this.store = [...this.store,object];
	}
	
	get(){
		if(null==this.store){
			this.clear();
		}
		return this.store;
	}
	
	setAuthUser(logged){
		this.logged = logged;
	}
	
	getAuthUser(){
		return this.logged;
	}
	
	localStorageClear(){
		var size = this.localStorageKeys.length;
		for(var i = 0; i < size; i++){
			if(this.localStorageKeys[i].indexOf('_doc_base_') != -1){
				continue;
			}
		    this.localStorageRemoveItem(this.localStorageKeys[i]);
		}
		this.localStorageKeys = null;
	}
	
	localStorageSetItem(key,value,persistent){
		this.localStorageRemoveItem(key);
	    if(persistent){
	    	localStorage.setItem(key,value);
	    	return;
	    }
		sessionStorage.setItem(key,value);
		if(null==this.localStorageKeys){
			this.localStorageKeys = [];
		}
		if(!(this.localStorageKeys.includes(key))){
			this.localStorageKeys = [...this.localStorageKeys,key];
		}
	}
	
	localStorageGetItem(key){
	    var value = sessionStorage.getItem(key);
	    if(undefined != value && null != value){
	    	return value;
	    }
		return localStorage.getItem(key);
	}
	
	localStorageRemoveItem(key){
		localStorage.removeItem(key);
	    sessionStorage.removeItem(key);
	}
	
	
	
}