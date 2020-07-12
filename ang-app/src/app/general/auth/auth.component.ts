import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { BaseCrudFilterComponent } from '../../base/basecrudfilter.component';

@Component({
  selector: 'auth-root',
  templateUrl: './auth.component.html',
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false
})
export class AuthComponent extends BaseCrudFilterComponent implements OnInit, OnDestroy{

  loginForm: FormGroup;
  changePasswordForm: FormGroup;
  loginModal: NgbModalRef;
  lostPassword: Boolean;
  confirmationCodeError: Boolean;
  loginConfirmation: string;
  passwordValidationMessage: any;
  verifyActivityInterval: any;
  tryTimes: number;
  
  ngOnInit() {
	  this.setInitializationServices(['user']);
	  this.crudService = this.userService;
	  this.sucessErrorMessages = {
	  	  200:  'Registro efetuado com sucesso.<br/>Aguarde envio do e-mail...',
	      210:  'Registro efetuado com sucesso.<br/>Acesse seu e-mail e efetue a ativação do acesso.',
	      211:  'Troca de senha efetuada com sucesso.',
	      202:  'Solicitação realizada. Enviaremos Nova senha e Novo código de confirmação por e-mail, caso a conta exista ...',
	      602:  'Sua sessão expirou após 20 minutos de inatividade. Efetuando logoff ...'
	  };
	  this.dataForm = new FormGroup({
	      name: new FormControl('', [Validators.required]),
	      email: new FormControl('', [Validators.required, Validators.email]),
	      password: new FormControl('', [Validators.required]),
	      re_password: new FormControl('', [Validators.required]),
	      acceptTerms: new FormControl('', [])
	  });
	  this.changePasswordForm = new FormGroup({
          password: new FormControl('', [Validators.required]),
          new_password: new FormControl('', [Validators.required]),
          re_new_password: new FormControl('', [Validators.required]),
      });
	  this.loginForm = new FormGroup({
          email: new FormControl('', [Validators.required, Validators.email]),
          password: new FormControl('', [Validators.required]),
          confirmation_code: new FormControl('', [])
      });
	  super.ngOnInit();
  }
  
  ngOnDestroy(){
  	  this.loginForm = null;
  	  this.changePasswordForm = null;
  	  this.loginModal = null;
  	  this.lostPassword = null;
      this.confirmationCodeError = null;
      this.loginConfirmation = null;
      this.passwordValidationMessage = null;
      clearInterval(this.verifyActivityInterval);
  	  this.verifyActivityInterval = null;
  	  this.tryTimes = null;
	  super.ngOnDestroy();
  }
  
  listData(){}// do nothing
  
  private verifyInactivity(){
	  const lastActivity = this.storageService.localStorageGetItem('_lastActivity_' + this.getAppId());
	  const lastActivity2 = this.emptyString(lastActivity) ? 0 : parseInt('0' + lastActivity);
	  if(!(lastActivity2 > 0)){
		  this.setInActivity();
		  return;
	  }
	  if((new Date().getTime() - lastActivity2) > 1200000){
		  this.setStatusCode(602);
		  this.clearMessages(4000);
		  this.logout();
	  }
  }
  
  login(modalId){
	  if(null!=this.logged){
		  return;
	  }
	  this.tryTimes = 0;
      this.validationMessages = [];
	  this.loginConfirmation = null;
	  this.lostPassword = false;
	  this.onOpenModalForm(this.loginForm);
	  this.loginModal = this.modalService.open(modalId,this.modalConfigs);
  }
  
  logout(){
	  if(null==this.logged){
		  return;
	  }
	  this.logged.ownerId = parseInt(this.storageService.localStorageGetItem('_ownerId_' + this.getAppId()));
	  this.logged._token = this.storageService.localStorageGetItem('_token_' + this.getAppId());
	  this.userService.loggofUser(this.logged).then(result => {
		  if(!this.emptyObject(result)){
			  this.processObjectAndValidationResult(result,true);
			  return;
		  }
		  clearInterval(this.verifyActivityInterval);
		  this.verifyActivityInterval = null;
		  this.eventEmitterService.get('unregisterSubscriptions').emit({});
	  });
  }
	
  onLoginFormSubmit(){
	  this.processValidation = true; 
	  this.validationMessages = [];
	  if(this.canceling){
		  this.canceling = false;
		  this.loginForm.reset();
		  this.clearMessages(0);
		  this.setProcessing(false);
		  this.loginModal.close();
		  return;
	  }
	  if(this.lostPassword){
		  this.recoverPassword();
		  return;
	  }
	  this.confirmationCodeError = false;
	  if(this.emptyString(this.loginConfirmation)){
	      this.makeLogin();
		  return;
	  }
	  let user = this.loginForm.value;
	  if(this.loginConfirmation != user.confirmation_code.trim()){
		  this.setConfirmationError();
		  return;
	  }
	  this.setProcessing(true); 
	  this.userService.loadForActivation(user).then(user2 => {
	      if(this.emptyObject(user2) || !this.processObjectAndValidationResult(user2,false)){
	    	  this.setLoginError();
	    	  return;
	      }
	      this.userService.activateUser(user2).then(user3 => {
	    	  if(!this.processObjectAndValidationResult(user3,false)){
	    		  this.setConfirmationError();
	    		  return;
	    	  }
	    	  this.makeLogin();
	      });
	  });
  }
	
  private setConfirmationError(){
	  this.confirmationCodeError = true;
	  this.addValidationMessage('Código de Confirmação diferente do enviado por e-mail!');
	  this.setProcessing(false); 
  }
	
  private setLoginError(){
	  this.addValidationMessage('Login e/ou Senha inválido(s)!');
	  this.setProcessing(false); 
  }
	
  private setLoginErrorTreece(){
	  this.addValidationMessage('Tentativas de login fracassadas: 3. <br/>Aguarde 5 minutos para tentar novamente.');
	  this.setProcessing(false); 
  }
	
  private validateLoginForm(): Boolean{
      if(this.errorRequiredForm(this.loginForm,'email')){
		  this.addValidationMessage('Login é requerido!');
	  }
	  if(this.errorEmailForm(this.loginForm,'email')){
		  this.addValidationMessage('Login deve ser um endereço de email válido!');
	  }
	  if(!this.lostPassword && this.errorRequiredForm(this.loginForm,'password')){
		  this.addValidationMessage('Senha é requerida!');
	  }
	  if(!this.lostPassword && this.errorRequiredForm(this.loginForm,'confirmation_code')){
		  this.addValidationMessage('Código de Confirmação é requerido!');
	  }
	  if(this.tryTimes > 0 && !this.captchaOk){
	      var msg = 'Captcha digitado não confere! Confirme que não é um robô e digite o captcha corretamente!';
	  	  this.addValidationMessage(msg);
	  }
	  return !this.inValidationMsgs();
  }
	
  private makeLogin(){
	  this.logged = null;
	  this.processValidation = true; 
	  this.validationMessages = [];
	  if(!this.validateLoginForm()){
	      return;
	  }
	  this.preProcessConfigurations();
	  let user = this.loginForm.value;
	  this.tryTimes = 0;
	  this.userService.loginUser(user).then(result => {
	      if(this.emptyObject(result)){
	    	  this.setLoginError();
	    	  this.tryTimes ++;
	    	  this.captchaOk = false;
	    	  return;
	      }
	      if(!(this.processObjectAndValidationResult(result,false))){
    		  this.setProcessing(false);
    		  this.tryTimes ++;
    		  this.captchaOk = false;
    		  return;
    	  }
    	  if(result.name.trim() == '404'){
    		  this.setLoginErrorTreece();
	    	  this.tryTimes ++;
	    	  this.captchaOk = false;
	    	  return;
    	  }
    	  this.loginConfirmation = null;
    	  if(!this.emptyString(result.confirmation_code)){
    		  this.loginConfirmation = result.confirmation_code.trim();
    		  this.setProcessing(false);
    		  return;
    	  }
    	  if(!result.active){
    		  this.setLoginError();
	    	  this.tryTimes ++;
	    	  this.captchaOk = false;
    		  return;
    	  }
    	  this.logged = result;
		  this.storageService.setAuthUser(this.logged);
		  this.userServiceRouter.setLogged(this.logged);
		  var thisThis = this;
		  this.verifyActivityInterval = setInterval(() => {thisThis.verifyInactivity();},10000);
		  this.processValidation = false;
		  this.loginForm.reset();
		  this.clearMessages(null);
		  this.setProcessing(false);
		  this.storageService.localStorageSetItem('_ownerId_' + this.getAppId(),'' + this.logged.id,false);
		  this.storageService.localStorageSetItem('logged.category','' + this.logged.category,false);
		  this.loginModal.close();
		  this.eventEmitterService.get('home').emit({object: this.logged});
	  });
  }
	
  changeMyPassword(modalId){
	  if(null==this.logged){
		  return;
	  }
	  if(null!=this.formModal){
		  this.formModal.close();
	  }
	  this.onOpenModalForm(this.changePasswordForm);
	  this.formModal = this.modalService.open(modalId,this.modalConfigs);
  }
	
  private validateChangePasswordFormFields(){
	  if(this.errorRequiredForm(this.changePasswordForm,'password')){
		  this.addValidationMessage('Senha é requerida!');
	  }
	  if(this.errorRequiredForm(this.changePasswordForm,'new_password')){
		  this.addValidationMessage('Nova Senha é requerida!');
	  }
	  if(this.errorRequiredForm(this.changePasswordForm,'re_new_password')){
		  this.addValidationMessage('Confirmação da Nova Senha é requerida!');
	  }
	  if(this.inValidationMsgs()){
		  return null;
	  }
	  var pass = this.changePasswordForm.value;
	  if(pass.password.trim() != this.logged.password){
		  this.addValidationMessage('Senha não confere!');
	  }
	  if(pass.password.trim() == this.logged.password && pass.new_password.trim() == this.logged.password){
		  this.addValidationMessage('Nova Senha não pode ser a senha atual!');
	  }
	  if(pass.new_password.trim() != pass.re_new_password.trim()){
		  this.addValidationMessage('Confirmação da Nova Senha não confere!');
	  }
	  if(this.inValidationMsgs()){
		  return null;
	  }
	  var user = this.logged;
	  user.password = pass.new_password.trim();
	  user.ownerId = parseInt(this.storageService.localStorageGetItem('_ownerId_' + this.getAppId()));
	  user._token = this.storageService.localStorageGetItem('_token_' + this.getAppId());
	  return user;
  }
	
  onChangePasswordFormSubmit(){
	  this.validationMessages = [];
	  this.processValidation = true;
	  if(this.canceling){
		  this.canceling = false;
		  this.changePasswordForm.reset();
		  this.clearMessages(0);
		  this.setProcessing(false);
		  return;
	  }
	  var user = this.validateChangePasswordFormFields();
	  if(null==user){
		  return;
	  }
	  this.setProcessing(true);
	  this.userService.update(user.id,user).then(user2 => {
		  if(this.processObjectAndValidationResult(user2,true)){
			  this.formModal.close();
    		  this.logged.password = user.password;
    		  this.setStatusCode(211);
			  this.clearMessages(null);
			  this.setProcessing(false);
			  return;
    	  }
		  var pass = this.changePasswordForm.value;
		  this.logged.password = pass.password.trim();
		  this.formModal.close();
		  this.clearMessages(null);
		  this.setProcessing(false);
	  });
  }
	
  register(modalId){
      if(null!=this.logged){
		  return;
	  }
	  this.captchaOk = false;
      this.selectedObject = null;
      this.onOpenModalForm(this.dataForm);
	  this.formModal = this.modalService.open(modalId,this.modalConfigs);
  }
    
  prepareToSaveUpdate(user){
      return this.userService.prepareForRegistration(user);;
  }
	
  validateFormFields(): Boolean{
	  if(this.errorRequired('name')){
		  this.addValidationMessage('Nome é requerido!');
	  }
	  if(this.errorRequired('email')){
		  this.addValidationMessage('E-mail é requerido!');
	  }
	  if(this.errorEmail('email')){
		  this.addValidationMessage('E-mail deve ser um endereço de email válido!');
	  }
	  if(this.errorRequired('password')){
		  this.addValidationMessage('Senha é requerida!');
	  }
	  if(this.errorRequired('re_password')){
		  this.addValidationMessage('Confirmação da Senha é requerida!');
	  }
	  var obj = this.dataForm.value;
	  if(null==obj.acceptTerms || !obj.acceptTerms){
		  var msg = 'É necessário que você declare que aceita as políticas do site.<br/>';
		  msg += ' Marque a caixa de seleção: <strong>Eu declaro que li na íntegra ...</strong>';
		  this.addValidationMessage(msg);
	  }
	  if(!this.captchaOk){
	      var msg = 'Captcha digitado não confere! Confirme que não é um robô e digite o captcha corretamente!';
	  	  this.addValidationMessage(msg);
	  }
	  return !this.inValidationMsgs();
  }
	
  validatePasswordForce(password){
	  this.validationMessages = [];
	  this.processValidation = false;
	  this.passwordValidationMessage = null;
	  if(this.emptyString(password.trim())){
		  return;
	  }
	  var validation = this.stringService.validatePassword(password,true);
	  if(validation.code == 200){
		  this.passwordValidationMessage = validation;
		  return;
	  }
	  this.processValidation = true;
	  this.addValidationMessage('[' + validation.code + '] ' + validation.msg);
  }
	
  preValidateToSaveUpdate(user): boolean{
	  var validation = this.stringService.validatePassword(user.password,false);
	  if(validation.code != 200){
		  this.addValidationMessage('[' + validation.code + '] ' + validation.msg);
	  }
	  if(user.password != user.re_password){
		  this.addValidationMessage('A Confirmação da Senha não confere com a Senha!');
	  }
	  if(!(this.stringService.validateEmail(user.email))){
	      this.addValidationMessage('E-mail deve ser um endereço de email válido!');
	  }
	  return !this.inValidationMsgs();
  }
	
  callbackAfterCreate(user){
	  this.setStatusCode(210);
	  this.clearMessages(3000);
	  this.setProcessing(false);
  }
	
  iLostPassword(lost){
	  this.lostPassword = lost;
	  this.validationMessages = [];
  }
	
  recoverPassword(){
	  if(!this.validateLoginForm()){
	      return;
	  }
	  let user = this.loginForm.value;
	  this.setStatusCode(202);
	  this.setProcessing(true);
	  this.userService.recoverPassword(user).then(user2 => {
  	  	  this.processObjectAndValidationResult(user2,false);
  	      this.closeRecoverPassword();
  	  });
  }
	
  private closeRecoverPassword(){
	  this.lostPassword = false;
	  this.loginForm.reset();
	  this.loginModal.close();
	  this.clearMessages(null);
	  this.setProcessing(false);
  }
  
}