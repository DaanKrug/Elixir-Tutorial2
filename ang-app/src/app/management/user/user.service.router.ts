import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { User } from './user';
import { AppConfig } from '../../app.config';
 
@Injectable({providedIn: 'root'})
export class UserServiceRouter implements CanActivate {
	
  logged: User;
  lastNavigated: string;
  defaultPath: string;
  defaultTitle: string;
  
  constructor(private router: Router) {
	  this.defaultPath = 'home';
	  this.defaultTitle = 'Home';
  }
  
  isLogged(){
	  return (null!=this.logged);
  }
  
  setLogged(user: User){
	  this.logged = user;
  }
  
  //navigation control
  canActivate(route: ActivatedRouteSnapshot,state: RouterStateSnapshot): Observable<boolean> | boolean {
      var nav = true;
	  var path = route.routeConfig.path;
      if(!this.isLogged()){
    	  this.lastNavigated = this.defaultPath;
		  this.router.navigate(['/' + this.defaultPath], { skipLocationChange: true });
		  return false;
      }
      if(path != this.defaultPath && AppConfig.authViews.includes(path)){
    	  for(var i = 0; i < AppConfig.categories.length; i++){
			  if(AppConfig.categories[i][0]==path){
				  nav = AppConfig.categories[i][1].includes(this.logged.category);
				  break;
			  }
		  }
      }
	  if(!nav){
		  this.lastNavigated = this.defaultPath;
		  this.router.navigate(['/' + this.defaultPath], { skipLocationChange: true });
		  return false;
	  }
	  this.lastNavigated = path;
	  return true;
  }
  
  getLastNavigated(){
	  return this.lastNavigated;
  }
  getDefaultPath(){
	  return this.defaultPath;
  }
  getDefaultTitle(){
	  return this.defaultTitle;
  }
  
  
}