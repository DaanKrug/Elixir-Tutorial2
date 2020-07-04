import { User } from './user';
import { BaseCrudService } from '../../../app_base/basecrud.service';
 
export class UserService extends BaseCrudService{
	
  authUrl: Boolean;
  logged: User;
  
  getUrl(){
	  return this.getBase() + (this.authUrl ? '/auth' : '/users');
  }
  
  getEmptyObject(conditions) :Object{
	  var ownerId: number = parseInt('0' + this.storageService.localStorageGetItem('_ownerId_' + this.getAppId()));
	  return new User(0,conditions,null,null,null,'enroll',null,false,
			          ownerId,
		              null,
		              this.storageService.localStorageGetItem('_token_' + this.getAppId()),null);
  }

  getAll(page,rows,conditions): Promise<User[]> {
	  return new Promise<User[]>(r => r(super.getAll(page,rows,this.getEmptyObject(conditions))));
  }
  
  load(id): Promise<User> {
	  return new Promise<User>(r => r(super.load(id)));
  }
  
  private assertAuthUser(user1: User, user2: User){
	  this.logged = null;
	  if(undefined!=user2 && null!=user2
			  && undefined != user1.email && undefined != user2.email
			  && undefined != user1.password && undefined != user2.password
			  && user1.email == user2.email && user1.password == user2.password){
		  this.logged = user2;
		  return true;
	  }
	  return false;
  }
 
  private loadByUser(user: User, patch: boolean): Promise<User> {
	  return super.loadByObject(user,patch).then((res: any) => {
		  if(undefined!=res && null!=res && res.length > 0){
			  return res[0];
		  }
		  return null;
	  });
  }
  
  private shouldReturn(user,user2){
	  if((null!=user2 && user2.name == '404') 
			  || this.assertAuthUser(user,user2) 
			  || (null!=user2 && user2.objectClass != '')){
		  return true;
	  }
	  return false;
  }
  
  loginUser(user: User): Promise<User>{
	  this.authUrl = true;
	  user.id = -1;
	  user.confirmation_code = null;
	  user._token = this.storageService.localStorageGetItem('_token_' + this.getAppId());
  	  return this.loadByUser(user,false)
	  	         .then((user2: User) => {return (this.shouldReturn(user,user2) ? user2 : null);})
	  	         .catch(this.handleError)
  	  			 .finally(() => {this.authUrl = false;});
  }
  
  loggofUser(user): Promise<User>{
	  this.setInActivity();
	  this.authUrl = true;
	  user.id = -1;
  	  return this.loadByUser(user,true)
	  	         .then((user2: User) => {return (this.assertAuthUser(user,user2) ? null : user2);})
	  	         .catch(this.handleError)
  	  			 .finally(() => {this.authUrl = false;});
  }
  
  prepareForRegistration(user){
  	user.id = -1;
	user._token = this.storageService.localStorageGetItem('_token_' + this.getAppId());
	return user;
  }
  
  loadForActivation(user): Promise<User>{
	  return this.loadByUser(this.prepareForRegistration(user),false);
  }
  
  activateUser(user): Promise<User>{
	  return this.http.put(
			      this.getBase() + '/user_activate' + this.getAntiCache(),
		    	  this.stringify(this.prepareForRegistration(user)),
		    	  this.options
		      )
		      .toPromise()
		      .then((response: any) => {return response;})
		      .catch(this.handleError);
  }
	
  recoverPassword(user): Promise<User>{
	  return this.http.put(
			      this.getBase() + '/user_recover' + this.getAntiCache(),
		          this.stringify(this.prepareForRegistration(user)),
		    	  this.options
		      )
		      .toPromise()
		      .then((response: any) => {return response;})
		      .catch(this.handleError);
  }
  
  mergeAnotherInObject(object,anotherObject){
	  object.name = super.getChangedValue(anotherObject.name,object.name);
	  object.email = super.getChangedValue(anotherObject.email,object.email);
	  object.password = super.getChangedValue(anotherObject.password,object.password);
	  object.category = super.getChangedValue(anotherObject.category,object.category);
	  object.permissions = super.getChangedValue(anotherObject.permissions,object.permissions);
	  object.active = super.getChangedValue(anotherObject.active,object.active);
	  object.ownerId = super.getChangedValue(anotherObject.ownerId,object.ownerId);
  	  return object;
  }
  
}