import { Injectable } from '@angular/core';
import { ValidationResult } from '../validation/validation.result';

@Injectable({providedIn: 'root'})
export class StringService{
	
	alphaA: any[];
    alphaa: any[];
	alphaE: any[];
	alphae: any[];
    nums: any[];
    doubles: any[];
    specials: any[];
    specialsLabel: string;
    minChars: number;
    maxChars: number;
	
	constructor(){
		this.alphaE = ['Ã','Á','À','Â','Ä','É','È','Ê','Ë','Í','Ì','Î','Ï','Õ','Ó','Ò','Ô','Ö','Ú','Ù','Û','Ü','Ç'];
		this.alphae = ['ã','á','à','â','ä','é','è','ê','ë','í','ì','î','ï','õ','ó','ò','ô','ö','ú','ù','û','ü','ç'];
		this.alphaA = ['A','B','C','D','E','F','G','H','I','J','K','L',
	                    'M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
	    this.alphaa = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p',
	                    'q','r','s','t','u','v','w','x','y','z'];
	    this.nums = ['0','1','2','3','4','5','6','7','8','9'];
	    this.doubles = ['0','1','2','3','4','5','6','7','8','9',',','-'];
	    this.specials = ['(',')','*','-','+','%','@','_','.',',','$',':',' ','/'];
	    this.specialsLabel = '<strong>( ) * - + % @ _ . , $ : \' \'(espaço em branco)</strong>';
	    this.minChars = 16;
	    this.maxChars = 52;
	}
	
	private isValidInputAlphaChar(char){
		return (char == ' ' || this.alphaA.includes(char) || this.alphaa.includes(char)
				|| this.alphaE.includes(char) || this.alphae.includes(char));
	}
	
	private isValidInputAlphaNumChar(char){
		return (this.isValidInputAlphaChar(char) || this.doubles.includes(char));
	}
	
	private isValidInputTextChar(char){
		return (this.isValidInputAlphaChar(char) || this.nums.includes(char) || this.specials.includes(char));
	}
	
	scapeInvalidCharsFromInputText(value){
		var value2 = '';
		var size = value.length;
		for(var i = 0; i < size; i++){
			if(this.isValidInputTextChar(value.charAt(i))){
				value2 += value.charAt(i);
			}
		}
		return value2;
	}
	
	scapeInvalidCharsFromInputAlpha(value){
		var value2 = '';
		var size = value.length;
		for(var i =0; i< size; i++){
			if(this.isValidInputAlphaChar(value.charAt(i))){
				value2 += value.charAt(i);
			}
		}
		return value2;
	}
	
	scapeInvalidCharsFromInputAlphaNum(value){
		var value2 = '';
		var size = value.length;
		for(var i =0; i< size; i++){
			if(this.isValidInputAlphaNumChar(value.charAt(i))){
				value2 += value.charAt(i);
			}
		}
		return value2;
	}
	
	scapeInvalidCharsFromInputNumber(value){
		var value2 = '';
		var size = value.length;
		var ccommas = 0;
		var comma = ',';
		var minus = '-';
		for(var i = 0; i < size; i++){
			if((i == 0 || i == (size - 1) || ccommas > 0) && value.charAt(i) == comma){
				continue;
			}
			if(i != 0 && value.charAt(i) == minus){
				continue;
			}
			if(this.doubles.includes(value.charAt(i))){
				value2 += value.charAt(i);
			}
			if(value.charAt(i) == comma){
				ccommas ++;
			}
		}
		return value2;
	}
	
	numberGreaterEqual(value,greater){
		if(undefined==value || null==value){
			return false;
		}
		if(undefined==greater || null==greater){
			return true;
		}
		var n = parseFloat(('0' + value).replace(',','.'));
		var g = parseFloat(('0' + greater).replace(',','.'));
		return (n >= g);
	}
	
	numberSmallerEqual(value,smaller){
		if(undefined==value || null==value){
			return false;
		}
		if(undefined==smaller || null==smaller){
			return true;
		}
		var n = parseFloat(('0' + value).replace(',','.'));
		var s = parseFloat(('0' + smaller).replace(',','.'));
		return (n <= s);
	}
	
	capitalize(value) {
		const arr = value.split(' ');
		var newStr = '';
		const size = arr.length;
		for(var i = 0; i < size; i++){
			if(null==arr[i] || arr[i].trim() == ''){
				continue;
			}
			newStr += ' ';
			newStr += arr[i].charAt(0).toUpperCase();
			newStr += arr[i].slice(1).toLowerCase();
		}
		return newStr.trim();
    }
    
    moneyFormat(value,digits){
    	value = this.replaceAll(value,'.',',');
    	var arr = value.split(',');
    	var size = arr.length;
    	var prefix = '';
    	for(var i = 0; i < (size - 1); i++){
    		prefix += arr[i];
    	}
    	if(!(size > 1)){
	    	prefix = arr[0];
    	}
    	if(!(digits > 0)){
    		return prefix;
    	}
    	var sufix = (size > 1) ? '' +  arr[arr.length - 1] : '';
    	while(sufix.length < digits){
    		sufix += '0';
    	}
    	if(sufix.length > digits){
    	    var rest = parseInt('0' + sufix.substring(0,digits));
    		var rest2 = parseInt('0' + sufix.substring(digits,digits + 1));
    		sufix = '' + (rest + ((rest2 >= 5) ? 1 : 0));
    	}
    	if(sufix.length > digits){
    	    prefix = '' + (parseInt('0' + prefix) + 1);
    		sufix = '' + ((parseInt('0' + sufix))%(Math.pow(10,digits)));
    	}
    	while(sufix.length < digits){
    		sufix = ('0' + sufix);
    	}
    	return prefix + ',' + sufix;
    }
	
    validatePassword(password: string, verifyForce: boolean): ValidationResult{
    	var validation = new ValidationResult(200,'OK','OperationsSuccess');
    	if(undefined == password || null==password){
    		validation.code = 977;
    		validation.msg = 'Senha é requerida.';
    		return validation;
    	}
    	password = password.trim();
    	if((password.length < this.minChars || password.length > this.maxChars)){
    		validation.code = 978;
    		validation.msg = 'Senha inválida. Deve ter entre ' + this.minChars + ' e ' + this.maxChars + ' caracteres.';
    		return validation;
    	}
    	const size = password.length;
    	var isAlphaA = false;
    	var isAlphaa = false;
    	var isNums   = false;
    	var isSpecials = false;
    	var Aas = [];
    	var aas = [];
    	var nuns = [];
    	var spcs = [];
    	for(var i = 0; i < size; i++){
    		var inChars = false;
    		if(this.alphaA.includes(password.charAt(i))){
    			inChars  = true;
    			isAlphaA = true;
    			if(!(Aas.includes(password.charAt(i)))){
    				Aas = [...Aas,password.charAt(i)];
    			}
    		}
    		if(this.alphaa.includes(password.charAt(i))){
    			inChars  = true;
    			isAlphaa = true;
    			if(!(aas.includes(password.charAt(i)))){
    				aas = [...aas,password.charAt(i)];
    			}
    		}
    		if(this.nums.includes(password.charAt(i))){
    			inChars = true;
    			isNums  = true;
    			if(!(nuns.includes(password.charAt(i)))){
    				nuns = [...nuns,password.charAt(i)];
    			}
    		}
    		if(this.specials.includes(password.charAt(i))){
    			inChars = true;
    			isSpecials = true;
    			if(!(spcs.includes(password.charAt(i)))){
    				spcs = [...spcs,password.charAt(i)];
    			}
    		}
    		if(!inChars){
    			var msg = 'Senha inválida. O caracter da posição [' + (i + 1) + '] não está';
    			msg += ' entre os caracteres permitidos: letras maiúsculas e minúsculas, números,';
    			msg += ' e os caracteres: ' + this.specialsLabel;
    			validation.code = 979;
        		validation.msg = msg;
        		return validation;
    		}
    	}
    	if(!isAlphaA || !isAlphaa || !isNums || !isSpecials){
    		var msg = 'Senha inválida. Deve conter ao menos: 1 letra maiúscula,';
    		msg += ' 1 letra minúscula, 1 número, e 1 dos seguintes';
    		msg += ' caracteres: ' + this.specialsLabel;
			validation.code = 979;
    		validation.msg = msg;
    		return validation;
    	}
    	var repeated = 0;
    	for(var i = 0; i < size; i++){
    		if(i > 0 && (password.charAt(i) == password.charAt(i - 1))){
    			repeated++;
    		}
    		if(repeated > 0){
    			var msg = 'Senha inválida. O caracter da posição [' + (i + 1) + '] repete o caracter anterior.';
    			msg += ' Não é aceita a repetição de caracteres.';
    			validation.code = 980;
        		validation.msg = msg;
        		return validation;
    		}
    	}
    	if(verifyForce){
    		var diffMax = this.maxChars - this.minChars;
	    	var max = Math.pow((diffMax/3)*2,2);
	    	var force = 0;
	    	force += Math.pow(password.length - 1,2);
	    	if(repeated > 0){
	    		force -= Math.pow(repeated,3);
	    	}
	    	if(force > max){
	    		force = max;
	    	}
	    	if(force < 0){
	    		force = 0;
	    	} 
	    	var perc = parseInt('0' + (force/max * 100));
	    	var passForce = 'Segurança básica';
	    	if(perc > 45){
	    		passForce = 'Segurança regular';
	    	}
	    	if(perc > 70){
	    		passForce = 'Segurança média';
	    	}
	    	if(perc > 80){
	    		passForce = 'Segurança média alta';
	    	}
	    	if(perc > 90){
	    		passForce = 'Segurança alta';
	    	}
	    	var msg = 'Força da senha: ' + passForce;
	    	validation.msg = msg;
    	}
    	return validation;
    }
    
    generateCode3(size){
		var seq = '';
		for(var i = 0; i < size; i++){
			 seq += this.alphaA[Math.floor(Math.random() * this.alphaA.length)];
			 seq += this.alphaa[Math.floor(Math.random() * this.alphaa.length)];
			 seq += this.nums[Math.floor(Math.random() * this.nums.length)];
		}
		return seq;
	}
    
	generateCode4(size){
		var seq = '';
		for(var i = 0; i < size; i++){
			 seq += this.alphaA[Math.floor(Math.random() * this.alphaA.length)];
			 seq += this.alphaa[Math.floor(Math.random() * this.alphaa.length)];
			 seq += this.nums[Math.floor(Math.random() * this.nums.length)];
			 seq += this.specials[Math.floor(Math.random() * this.specials.length)];
		}
		return seq;
	}
	
	generateEmail(){
		var seq = '';
		for(var i = 0; i < 4; i++){
			 seq += this.alphaa[Math.floor(Math.random() * this.alphaa.length)];
			 seq += this.nums[Math.floor(Math.random() * this.nums.length)];
		}
		seq += new Date().getTime();
		seq += '@naotememail.com';
		return seq;
	}
	
	validateEmail(email){
		if(undefined == email || null == email || email.trim() == ''){
			return false;
		}
		var indexA = email.indexOf('@');
		var lindexA = email.lastIndexOf('@');
		var lindexD = email.lastIndexOf('.');
		var len = email.length;
		if(lindexA < 1 || lindexD < 1 || lindexA > (len - 2) || lindexD > (len - 2) || (lindexD < lindexA)){
			return false;
		}
		return true;
	}
	
	unentityLtGt(html){
		html = this.trimm(html);
		html = html.replace(/<br>/gi,'');
		html = html.replace(/<br\/>/gi,'');
		html = this.replaceAll(html,'&#9;','');
		html = this.replaceAll(html,'  ',' ');
		html = this.replaceAll(html,'&lt;','<');
		html = this.replaceAll(html,'&gt;','>');
		html = this.replaceAll(html,'"&quot;','"');
		html = this.replaceAll(html,'&quot;"','"');
		html = this.replaceAll(html,'&#34;','"');
		html = this.replaceAll(html,'<b>','<strong>');
		html = this.replaceAll(html,'</b>','</strong>');
		html = this.replaceAll(html,'<i>','<em>');
		html = this.replaceAll(html,'</i>','</em>');
		html = this.replaceAll(html,'<u>','<span style="text-decoration: underline;">');
		html = this.replaceAll(html,'</u>','</span>');
		html = this.replaceAll(html,'<font color="','<span style="color: ');
		html = this.replaceAll(html,'<font size="','<span style="font-size: ');
		html = this.replaceAll(html,'</font>','</span>');
		html = this.replaceAll(html,'<div><br></div>','');
		html = this.replaceAll(html,'<div><br/></div>','');
		html = this.replaceAll(html,'<div','<p');
		html = this.replaceAll(html,'</div','</p');
		html = this.sanitizeHtml(html);
		return html;
	}
	
	sanitizeHtml(html){
		html = this.trimm(html);
		html = this.replaceAll(html,'  ',' ');
		html = this.replaceAll(html,'<script>','<span>');
		html = this.replaceAll(html,'<script','<span');
		html = this.replaceAll(html,'<script ','<span ');
		html = this.replaceAll(html,'< script','<span');
		html = this.replaceAll(html,'</script','</span');
		return html;
	}
	
	replaceAll(origin,searchFor,replaceWhit){
		if(null==origin || this.trimm(origin) == '' ||
			null==searchFor || this.trimm(searchFor) == '' ||
			null==replaceWhit || this.trimm(replaceWhit) == ''){
			return origin;
		}
		origin = this.trimm(origin);
		searchFor = this.trimm(searchFor);
		replaceWhit = this.trimm(replaceWhit);
    	while(origin.indexOf(searchFor) != -1){
    		origin = origin.replace(searchFor,replaceWhit);
    	}
    	return origin;
	}
	
	replaceFirst(origin,searchTo,replaceTo){
		if(null==origin || this.trimm(origin) == '' ||
			null==searchTo || this.trimm(searchTo) == '' ||
			null==replaceTo || this.trimm(replaceTo) == ''){
			return origin;
		}
		origin = this.trimm(origin);
		searchTo = this.trimm(searchTo);
		replaceTo = this.trimm(replaceTo);
		if(origin.indexOf(searchTo) != -1){
			origin = origin.replace(searchTo,replaceTo);
		}
		return origin;
	}
	
	trimm(str){
    	if(undefined==str || null==str){
    		return '';
    	}
    	str = '' + str;
    	return str.replace(/^\s+|\s+$/g,'');
    }
	
	generateProtocol(id){
	   if(null==id || !(id > 0)){
		   return this.calculateProtocol('0');
	   }
	   return this.calculateProtocol('' + id);
    }
   
    private calculateProtocol(numberString){
       var number = parseInt(numberString);
       number = (number/111);
       number = (number/77);
       number = (number/23);
       numberString += number;
       numberString = numberString.replace(/\./gi,'');
	   while(numberString.length < 10){
		   numberString = '0' + numberString;
	   }
	   numberString = numberString.substring(0,10);
	   var protocol = '';
	   for(var i = 9; i >= 0; i--){
		   protocol += numberString.charAt(i);
	   }
	   return protocol;
    }
	
}