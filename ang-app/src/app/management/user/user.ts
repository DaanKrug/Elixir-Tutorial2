export class User {
   constructor(
		       public id: number, 
		       public conditions: string, 
   			   public name: string,
   			   public email: string,
   			   public password: string,
   			   public category: string,
   			   public permissions: string,
   			   public active: boolean,
   			   public ownerId: number,
   			   public confirmation_code: string,
   			   public _token: string,
   			   public objectClass: string
   			   ) { 
   }
}