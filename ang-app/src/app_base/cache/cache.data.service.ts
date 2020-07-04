import { Injectable } from '@angular/core';
import { CacheData } from './cache.data';

@Injectable({providedIn: 'root'})
export class CacheDataService{
	
	cache: CacheData[];
    invalidateInterval: any;
    maxTimeMinutes: number;

    constructor(){}
    
    start(maxTimeMinutes: number){
    	this.cache = [];
    	this.maxTimeMinutes = maxTimeMinutes;
    	var thisThis = this;
    	this.invalidateInterval = setInterval(
    		() => {
    			thisThis.invalidate();
    		}, 
    		(this.maxTimeMinutes * 60 * 1000)
        );
    }
    
    ngOnDestroy(){
    	clearInterval(this.invalidateInterval);
    	this.invalidateInterval = null;
    }
    
    addToCache(url: string, conditions: string, page: number, rows: number, data: any[]){
    	if(this.emptyOrNull(url)){
    		return;
    	}
    	if(this.emptyOrNull(conditions)){
    		conditions = '';
    	}
    	if(undefined==page || null==page){
    		return;
    	}
    	if(undefined==rows || null==rows){
    		return;
    	}
    	if(undefined==data || null==data || data.length == 0){
    		return;
    	}
    	const size = this.cache.length;
    	for(var i = 0; i < size; i++){
    		if(null!=this.cache[i] && this.trimm(this.cache[i].url) == this.trimm(url) 
    				&& this.trimm(this.cache[i].conditions) == this.trimm(conditions)
    				&& this.cache[i].page == page
    				&& this.cache[i].rows == rows){
    			this.cache[i].data = data;
    			this.cache[i].time = new Date().getTime();
    			return;
    		}
    	}
    	var cdata = new CacheData(url,conditions,page,rows,data,new Date().getTime());
    	this.cache = [...this.cache,cdata];
    }
    
    getFromCache(url: string, conditions: string, page: number, rows: number){
    	if(this.emptyOrNull(url)){
    		return null;
    	}
    	if(this.emptyOrNull(conditions)){
    		conditions = '';
    	}
    	if(undefined==page || null==page){
    		return null;
    	}
    	if(undefined==rows || null==rows){
    		return null;
    	}
    	const size = this.cache.length;
    	for(var i = 0; i < size; i++){
    		if(null!=this.cache[i] && this.trimm(this.cache[i].url) == this.trimm(url) 
    				&& this.trimm(this.cache[i].conditions) == this.trimm(conditions)
    				&& this.cache[i].page == page
    				&& this.cache[i].rows == rows){
    			return this.getValidData(i);
    		}
    	}
    	return null;
    }
    
    getObjectFromCache(url: string, id: number){
    	if(this.emptyOrNull(url)){
    		return null;
    	}
    	if(undefined==id || null==id){
    		return null;
    	}
    	const size = this.cache.length;
    	var object = null;
    	var lastTime = 0;
    	for(var i = 0; i < size; i++){
    		if(null!=this.cache[i] && this.trimm(this.cache[i].url) == this.trimm(url) 
    				               && (null==object || this.cache[i].time > lastTime)){
    			var object2 = this.getObjectFromData(i,id);
    			if(null!=object2){
    				lastTime = this.cache[i].time;
    				object = object2;
    			}
    		}
    	}
    	return object;
    }
    
    private getObjectFromData(cachePos,id){
    	var data = this.cache[cachePos].data;
    	const size = data.length;
    	for(var i = 0; i < size; i++){
    		if(data[i].id == id){
    			return data[i];
    		}
    	}
    	return null;
    }
    
    replaceOnCache(url: string,object: any){
    	if(this.emptyOrNull(url)){
    		return;
    	}
    	if(undefined==object || null==object || null==object.id || !(object.id > 0)){
    		return;
    	}
    	const size = this.cache.length;
    	var datas = [];
    	for(var i = 0; i < size; i++){
    		if(null!=this.cache[i] && this.trimm(this.cache[i].url) == this.trimm(url)){
    			this.replaceObjectOnData(i,object);
    		}
    	}
    }
    
    private replaceObjectOnData(cachePos,object){
    	var data = this.cache[cachePos].data;
    	const size = data.length;
    	for(var i = 0; i < size; i++){
    		if(data[i].id == object.id){
    			var oldObj = this.cache[cachePos].data[i];
    			if(undefined!=oldObj.totalRows && null!=oldObj.totalRows){
    				object.totalRows = oldObj.totalRows;
    			}
    			this.cache[cachePos].data[i] = object;
    			break;
    		}
    	}
    }
    
    private getValidData(pos: number){
    	const now = new Date().getTime();
		if((now - this.cache[pos].time) > (this.maxTimeMinutes * 60 * 1000)){
			this.cache[pos] = null;
			return null;
		}
		return this.cache[pos].data;
    }
    
    private invalidate(){
    	const size = this.cache.length;
    	if(size == 0){
    		return;
    	}
    	const now = new Date().getTime();
    	var newCache = [];
    	for(var i = 0; i < size; i++){
    		if(null==this.cache[i] || ((now - this.cache[i].time) > (this.maxTimeMinutes * 60 * 1000))){
    			continue;
    		}
    		newCache = [...newCache,this.cache[i]];
    	}
    	this.cache = newCache;
    }
    
    invalidateAll(url: string){
    	const size = this.cache.length;
    	if(this.emptyOrNull(url) || size == 0){
    		return;
    	}
    	const now = new Date().getTime();
    	var newCache = [];
    	for(var i = 0; i < size; i++){
    		if(null==this.cache[i] 
    		   || this.trimm(this.cache[i].url) == this.trimm(url)
    		   || ((now - this.cache[i].time) > (this.maxTimeMinutes * 60 * 1000))){
    			continue;
    		}
    		newCache = [...newCache,this.cache[i]];
    	}
    	this.cache = newCache;
    }
    
    private emptyOrNull(str){
    	if(undefined==str || null==str){
    		return true;
    	}
    	str = this.trimm(str);
    	return (str.length == 0);
    }
    
    private trimm(str){
    	if(undefined==str || null==str){
    		return '';
    	}
    	str = '' + str;
    	return str.replace(/^\s+|\s+$/g,'');
    }
    
}