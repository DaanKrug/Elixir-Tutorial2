import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { BaseCrudFilterComponent } from '../../base/basecrudfilter.component';

@Component({
  selector: 'user-root',
  templateUrl: './user.component.html',
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false
})
export class UserComponent extends BaseCrudFilterComponent implements OnInit, OnDestroy{
	
  passwordValidationMessage: any;
  categories: Object[];
  permissions: any[];
  permissionsAuditor: any[];
  permissionsAdmin: any[];
  permissionsEnroll: any[];
  permissionsExternal: any[];
  selectedPermissions: string[];

  ngOnInit() {
	  this.setInitializationServices(['user']);
	  this.crudService = this.userService;
	  this.sucessErrorMessages = {
		  200:  'Pessoa/Usuário adicionada com sucesso.',
		  201:  'Pessoa/Usuário alterada com sucesso.',
		  2010: 'Pessoa/Usuário inativada com sucesso.',
		  2011: 'Pessoa/Usuário ativada com sucesso.',
		  204:  'Pessoa/Usuário excluída com sucesso.',
		  207:  'Pessoa/Usuário restaurada com sucesso.',
		  208:  'Pessoa/Usuário excluída [PERMANENTE] com sucesso.',
	  };
	  this.listTitle = 'Pessoas/Usuários';
	  this.addTitle = 'Adicionar Pessoa/Usuário';
	  this.editTitle = 'Editar Pessoa/Usuário';
	  this.formInfo = ['** Requerido para criar usuário. Em branco mantém o valor atual.'];
	  this.dataForm = new FormGroup({
          name: new FormControl('', [Validators.required]),
          email: new FormControl('', [Validators.required,Validators.email]),
          password: new FormControl('', []),
          category: new FormControl('', [Validators.required])
      });
      this.categories = [
          {value: 'external' , label: 'Comunicação/Acesso Externa'},
      	  {value: 'enroll' , label: 'Integrante/Participante/Membro'},
      	  {value: 'admin' , label: 'Administrador'},
      	  {value: 'system_auditor', label: 'Auditor do Sistema'},
      ];
      this.permissionsAuditor = [
          {value: 'user' , label: 'Pessoas/Usuários', dependOf: null, breakBefore: true}
	  ];
	  this.permissionsAdmin = this.permissionsAuditor;
	  this.permissionsExternal = [];
	  this.permissionsEnroll = [];
      super.ngOnInit();
  }
  
  afterNgOnInit(){
	  this.parameterName = 'name/email';
  }
  
  ngOnDestroy(){
	  this.passwordValidationMessage = null;
	  this.categories = null;
	  this.permissions = null;
	  this.permissionsAuditor = null;
	  this.permissionsAdmin = null;
	  this.permissionsEnroll = null;
	  this.permissionsExternal = null;
	  this.selectedPermissions = null;
	  super.ngOnDestroy();
  }
  
  setTab(tab){
  	  super.setTab(tab);
  	  if(tab == 1){
  	      this.adjustPermissions(this.dataForm.value.category);
  	  }
  }
  
  setObject(user){
	  super.setObject(user);
	  this.dataForm.setValue({
			name: user.name,
			email: user.email,
			password: null,
			category: user.category
	  });
	  this.adjustPermissions(user.category);
  }
  
  adjustPermissions(category){
      this.selectedPermissions = [];
      this.permissions = null;
      if(this.emptyString(category)){
          return;
      }
      this.permissions = this.permissionsEnroll;
      if(category == 'system_auditor'){
      	  this.permissions = this.permissionsAuditor;
      }
      if(category == 'admin'){
      	  this.permissions = this.permissionsAdmin;
      }
      if(category == 'external'){
      	  this.permissions = this.permissionsExternal;
      }
	  if(null!=this.selectedObject.id && this.selectedObject.id > 0){
	      var userPermissions = this.selectedObject.permissions.split(",");
	      var size = userPermissions.length;
	      var size2 = this.permissions.length;
	      for(var i = 0; i < size; i++){
	          for(var j = 0; j < size2; j++){
	              if(userPermissions[i] == this.permissions[j].value || userPermissions[i] == this.permissions[j].value + '_write'){
	              	  this.selectedPermissions = [...this.selectedPermissions,userPermissions[i]];
	              	  break;
	              }
	      	  }
	      }
	  }
  }
  
  checkPermission(permission){
  	  if(!(this.selectedPermissions.includes(permission))){
  	      this.selectedPermissions.unshift(permission);
  	  }
  }
  
  uncheckPermission(permission){
  	  this.selectedPermissions = this.removeFromArray(this.selectedPermissions,permission);
  	  if(permission == 'blogarticle'){
  	      this.uncheckPermission('blogarticlecomment');
  	  }
  	  if(permission == 'pagemenu'){
  	      this.uncheckPermission('pagemenuitem');
  	  }
  	  if(permission == 'pagemenuitem'){
  	  	  this.uncheckPermission('pagemenuitemfile');
  	  }
  	  if(permission == 'user'){
  	  	  this.uncheckPermission('userpaymentticket');
  	  }
  	  if(permission.indexOf('_write') == -1){
  	  	  this.uncheckPermission(permission + '_write');
  	  }
  }
  
  makeSelectSearchedItemDestaked(user,destakSearch): Object{
	  user.name = this.makeDestak(user.name,destakSearch);
	  user.email = this.makeDestak(user.email,destakSearch);
	  return user;
  }
  
  prepareToSaveUpdate(user){
      user.permissions = this.selectedPermissions.join(",");
	  return user;
  }
  
  validateFormFields(): Boolean{
	  if(this.errorRequired('name')){
		  this.addValidationMessage('Nome é requerido!');
	  }
	  if(this.errorRequired('category')){
		  this.addValidationMessage('Categoria/Permissão é requerida!');
	  }
	  if(this.errorRequired('email')){
		  this.addValidationMessage('E-mail é requerido!');
	  }
	  if(this.errorEmail('email')){
		  this.addValidationMessage('E-mail deve ser um endereço de email válido!');
	  }
	  return !this.inValidationMsgs();
  }
  
  validatePasswordForce(password){
	  this.validationMessages = null;
	  this.processValidation = false;
	  this.passwordValidationMessage = null;
	  if(this.emptyString(password)){
		  return;
	  }
	  var validation = this.stringService.validatePassword(password,true);
	  if(validation.code == 200){
		  this.passwordValidationMessage = validation;
		  return;
	  }
	  this.processValidation = true;
	  this.addValidationMessage(validation.msg);
  }
  
  preValidateToSaveUpdate(user): boolean{
	  this.passwordValidationMessage = null;
	  if(this.emptyString(user.email)){
		  this.addValidationMessage('E-mail é requerido!');
	  }
	  if(!(this.stringService.validateEmail(user.email))){
	      this.addValidationMessage('E-mail deve ser um endereço de email válido!');
	  }
	  if(!this.emptyString(user.password)){
		  var validation = this.stringService.validatePassword(user.password,false);
		  if(validation.code == 977 && !(this.idObjectEdit > 0)){
			  this.addValidationMessage(validation.msg);
		  }
		  if(validation.code != 200 && validation.code != 977){
			  this.addValidationMessage(validation.msg);
		  }
	  }
	  return !this.inValidationMsgs();
  }
  
}
