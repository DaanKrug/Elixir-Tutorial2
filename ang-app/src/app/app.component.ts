import { Component, OnInit, OnDestroy, 
         AfterViewInit, ViewEncapsulation }     from '@angular/core';
         
import { BaseCrudFilterComponent }              from './base/basecrudfilter.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false
})
export class AppComponent extends BaseCrudFilterComponent implements OnInit, OnDestroy, AfterViewInit{
   
	viewTitle: String;
    view: String;
    subscriptions: any[];
    showMenuOnTop: boolean;
    
	ngOnInit() {
		this.cacheDataService.start(15);
		this.messageEmitterService = null;
		this.setInitializationServices(['user']);
		this.crudService = this.userService;
		this.registerSubscriptions();
		this.viewTitle = '';
		this.showMenuOnTop = true;
	}
	
	ngOnDestroy(){
		this.unregisterSubscriptions();
		this.cacheDataService.ngOnDestroy();
	}
	
	ngAfterViewInit(){
		this.storageService.localStorageSetItem('loadedApp_' + this.getAppId(),'1',false);
	}
	
	registerSubscriptions(){
		var i = 0;
		this.subscriptions = [];
		this.subscriptions[i++] = this.eventEmitterService.get('unregisterSubscriptions')
		                              .subscribe(data => {this.unregisterSubscriptions();});
		this.subscriptions[i++] = this.eventEmitterService.get('addValidationStatusMessage')
		                              .subscribe(objectMsg => {super.addValidationStatusMessage(objectMsg.code,objectMsg.message);});
		this.subscriptions[i++] = this.eventEmitterService.get('clearMessages')
                                      .subscribe(objectTimeout => {super.clearMessages(objectTimeout.time);});
		this.subscriptions[i++] = this.eventEmitterService.get('openMessage')
                                      .subscribe(objectMsg => {super.openMessage(objectMsg.header,objectMsg.message);});
		this.subscriptions[i++] = this.eventEmitterService.get('home')
		                              .subscribe(data => {this.setLogged(data.object); this.homeView();});
		this.subscriptions[i++] = this.eventEmitterService.get('users').subscribe(data => {this.usersView();});
		
	}
	
	unregisterSubscriptions(){
		var size = this.subscriptions.length;
		for(var i = 0; i < size; i++){
			this.subscriptions[i].unsubscribe();
		}
		this.subscriptions = null;
		this.userServiceRouter.setLogged(null);
		this.router.navigate(['/']).then(res => {
			this.setLogged(null);
			this.storageService.localStorageClear();
			this.storageService.setAuthUser(null);
			window.location.reload();
		});
	}
	
	//navigation control
	homeView(){ 
		this.navigateTo('home','Início'); 
	}
	
	usersView(){ 
		this.navigateTo('users','Pessoas/Usuários'); 
	}
	
	navigateTo(path,title){
		if(this.userServiceRouter.getLastNavigated() == path){
			return;
		}
		this.setInActivity();
		this.router.navigate([path], { skipLocationChange: true }).then(res => {
			if(res && this.userServiceRouter.getLastNavigated() == path){
				this.view =  path;
				this.viewTitle = title;
				return;
			}
			this.view = this.userServiceRouter.getDefaultPath();
			this.viewTitle = this.userServiceRouter.getDefaultTitle(); 
		});
	}
	
	showHideTopMenu(){
		this.showMenuOnTop = !this.showMenuOnTop;
	}

}
