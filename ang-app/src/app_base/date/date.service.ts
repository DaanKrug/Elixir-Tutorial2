import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class DateService {
	
	oneDayTime: number = 24 * 60 * 60 * 1000;
    weekDays: string[] = ['Dom','Seg','Ter','Qua','Qui','Sex','Sab'];
    months: string[] = ['Janeiro','Fevereiro','Março','Abril','Maio',
    	                'Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

    leftZeros(value,len){
    	value = '' + value;
    	while(value.length < len){
    		value = '0' + value;
    	}
    	return value;
    }
	
    dateToHisString(d){
    	return this.leftZeros(d.getHours(),2) + ':' + this.leftZeros(d.getMinutes(),2) + ':' + this.leftZeros(d.getSeconds(),2);
    }
    
    dateToHiString(d){
    	return this.leftZeros(d.getHours(),2) + ':' + this.leftZeros(d.getMinutes(),2);
    }
    
    dateToDMString(d){
    	return this.leftZeros(d.getDate(),2) + '/' + this.leftZeros(d.getMonth() + 1,2);
    }
    
	dateInSkalla(dateS,dateF,skalla){
		var skdays = [skalla.dom,skalla.seg,skalla.ter,skalla.qua,skalla.qui,skalla.sex,skalla.sab];
		var d = dateS;
		while(d.getTime() <= dateF.getTime()){
			if(!skdays[d.getDay()]){
				return false;
			}
			d = this.addDay(d);
		}
		return true;
	}
	
	dateInWords(date){
		return date.getDate() + ' de ' + this.months[date.getMonth()] + ' de ' + date.getFullYear();
	}
	
	dateBrWhitTime(date){
		var d = this.leftZeros(date.getDate(),2);
		var m = this.leftZeros((date.getMonth() + 1),2);
        return d + '/' +  m + '/' + date.getFullYear() + ' ' + this.dateToHisString(date);
	}
	
	dateBrWhitoutTime(date){
		var d = this.leftZeros(date.getDate(),2);
		var m = this.leftZeros((date.getMonth() + 1),2);
        return d + '/' +  m + '/' + date.getFullYear();
	}
	
	private extractHourMinuteSecond(time){
		while(time.indexOf(':') != -1){
			time = time.replace(':','');
		}
		if(time.length != 6){
			return null;
		}
		var h = parseInt(time.substring(0,2));
		var i = parseInt(time.substring(2,4));
		var s = parseInt(time.substring(4));
		if(h < 0 || h > 23 || i < 0 || i > 59 || s < 0 || s > 59){
			return null;
		}
		return [''+h,''+i,''+s];
	}
	
	private extractDayMonthYear(date,separator){
		if(null==separator){
			separator = '/';
		}
		if(date.length != 8 && !(date.length == 10 && date.indexOf(separator) != -1)){
			return null;
		}
		var d,m,y;
		if(date.length == 8){
			d = date.substring(0,2);
			m = date.substring(2,4);
			y = date.substring(4);
			return [d,m,y];
		}
		var arr = date.split(separator);
		d = separator == '/' ? parseInt(arr[0]) : parseInt(arr[2]);
		m = parseInt(arr[1]);
		y = separator == '/' ? parseInt(arr[2]) : parseInt(arr[0]);
		if(y.length > 4){
			y = y.substring(0,4);
		}
		return [d,m,y];
	}
	
	private validateTimeOfDate(time){
		var his = this.extractHourMinuteSecond(time);
		return (null!=his);
	}
	
	validateDate(date: string){
		if(null==date){
			return false;
		}
		date = date.trim();
		var arr = (date.indexOf(' ') != -1) ? date.split(' ') : [date];
		if(arr.length > 1 && !this.validateTimeOfDate(arr[1])){
			return false;
		}
		var dmy = this.extractDayMonthYear(arr[0],'/');
		var daysMonth = [31,(((dmy[2]%4) == 0) ? 29 : 28),31,30,31,30,31,31,30,31,30,31];
		var dm = daysMonth[dmy[1]-1];
		if(dmy[0] > dm || dmy[0] > 31 || dmy[0] < 1 || dmy[1] > 12 || dmy[1] < 1 || dmy[2] > 9999 || dmy[2] < 1000){
			return false;
		}
		return true;
	}
	
	compareDate(dateS: string, dateF: string){
		var s = this.valuesDateToInt(dateS,'-');
		var f = this.valuesDateToInt(dateF,'-');
		var ds = new Date();
		ds.setFullYear(s.year, (s.month - 1), s.day);
		var df = new Date();
		df.setFullYear(f.year, (f.month - 1), f.day);
		return ((df > ds) ? 1 : ((df < ds) ? -1 : 0));
	}
	
	private getNextDayMonthYear(d,m,y){
		var daysMonth = [31,(((y%4) == 0) ? 29 : 28),31,30,31,30,31,31,30,31,30,31];
		var dm = daysMonth[m-1];
		if(d < dm){
			d ++;
			return [d,m,y];
		}
		if(m < 12){
			d = 1;
			m ++;
			return [d,m,y];
		}
		d = 1;
		m = 1;
		y ++;
		return [d,m,y];
	}
	
	nextDate(date: string){
		var arr = (date.indexOf(' ') != -1) ? date.split(' ') : [date];
		var dmy = this.extractDayMonthYear(arr[0],'-');
		var arrDayMonthYear = this.getNextDayMonthYear(dmy[0],dmy[1],dmy[2]);
		return arrDayMonthYear[2] + '-' +  this.leftZeros(arrDayMonthYear[1],2) + '-' + this.leftZeros(arrDayMonthYear[0],2);
	}
	
	dateToForm(date: string){
		if(null==date){
			return '';
		}
		if(date.indexOf('/') != -1){
			return date;
		}
		var arr = (date.indexOf(' ') != -1) ? date.split(' ') : [date];
		var dmy = this.extractDayMonthYear(arr[0],'-');
		return this.leftZeros(dmy[0],2) + '/' + this.leftZeros(dmy[1],2) + '/' + this.leftZeros(dmy[2],4);
	}
	
	dateToFormWhitTime(date: string){
		if(undefined == date || null == date){
			return '';
		}
		if(date.indexOf('/') != -1){
			return date;
		}
		var arr = (date.indexOf(' ') != -1) ? date.split(' ') : [date];
		var dmy = this.extractDayMonthYear(arr[0],'-');
		var result = this.leftZeros(dmy[0],2) + '/' + this.leftZeros(dmy[1],2) + '/' + this.leftZeros(dmy[2],4);
		if(!(arr.length > 1)){
			return result;
		}
		var his = this.extractHourMinuteSecond(arr[1]);
		if(null==his){
			return result;
		}
		return result + ' ' + this.leftZeros(his[0],2) + ':' + this.leftZeros(his[1],2) + ':' + this.leftZeros(his[2],2);
	}
	
	dateFromForm(date: string){
		if(null==date){
			return '';
		}
		const d = date + '';
		if(d.indexOf('-') != -1){
			return date;
		}
		var res = this.extractDateValues(d,'/');
		return res.year + '-' + res.month + '-' + res.day;
	}
	
	dateFromFormWhitTime(date: string){
		if(null==date){
			return '';
		}
		const d = date + '';
		if(d.indexOf('-') != -1){
			return date;
		}
		var res = this.extractDateValues(d,'/');
		return res.year + '-' + res.month + '-' + res.day + ' ' + res.hour + ':' + res.minute + ':' + res.second;
	}
	
	validateDateInterval(dateS,dateF){
		var s = this.valuesDateToInt(dateS,(dateS.indexOf('-') == -1 ? '/' : '-'));
		var f = this.valuesDateToInt(dateF,(dateF.indexOf('-') == -1 ? '/' : '-'));
		var ds = new Date();
		ds.setFullYear(s.year, (s.month - 1), s.day);
		ds.setHours(s.hour);
		ds.setMinutes(s.minute);
		ds.setSeconds(s.second);
		var df = new Date();
		df.setFullYear(f.year, (f.month - 1), f.day);
		df.setHours(f.hour);
		df.setMinutes(f.minute);
		df.setSeconds(f.second);
		return (df >= ds);
	}
	
	getBiggestDateSql(dateSql1,dateSql2){
		var d1 = this.dateSqltoDate(dateSql1);
		var d2 = this.dateSqltoDate(dateSql2);
		return (d1 > d2) ? d1 : d2;
	}
	
	equalDate(d1,d2,onlyMDY){
		if(undefined==d1 || null==d1 || undefined==d2 || null==d2){
    		return false;
    	}
		if(!onlyMDY){
			return (d1.getTime() == d2.getTime());
		}
		return (d1.getFullYear() ==  d2.getFullYear() 
				&& d1.getMonth() ==  d2.getMonth() 
				&& d1.getDate() ==  d2.getDate());
	}
	
	dateBrToDate(dateBr){
		var s = this.valuesDateToInt(dateBr,'/');
		var d = new Date();
		d.setFullYear(s.year, (s.month - 1), s.day);
		d.setHours(s.hour);
		d.setMinutes(s.minute);
		d.setSeconds(s.second);
		return d;
	}
	
	dateSqltoDate(dateSql){
		var s = this.valuesDateToInt(dateSql,'-');
		var d = new Date();
		d.setFullYear(s.year, (s.month - 1), s.day);
		d.setHours(s.hour);
		d.setMinutes(s.minute);
		d.setSeconds(s.second);
		return d;
	}
	
	dateSqltoTime(dateSql){
		return this.dateSqltoDate(dateSql).getTime();
	}
	
	dateToSqlDate(date){
		const m = this.leftZeros(date.getMonth() + 1,2);
		const d = this.leftZeros(date.getDate(),2);
		return date.getFullYear() + '-' + m + '-' + d + ' ' + this.dateToHisString(date);
	}
	
    valuesDateToInt(date: string, separator: string){
		var r = this.extractDateValues(date,separator);
		var d = parseInt(r.day);
		var m = parseInt(r.month);
		var y = parseInt(r.year); 
		var h = parseInt(r.hour);
		var i = parseInt(r.minute);
		var s = parseInt(r.second);
		return {day: d, month: m, year: y, hour: h, minute: i, second: s};
	}
	
	private extractDateValues(date: string, separator: string){
		date = date.trim();
		var arr = (date.indexOf(' ') != -1) ? date.split(' ') : [date];
		var d = '01';
		var m = '01';
		var y = '1000';
		var hh = '00';
		var mm = '00';
		var ss = '00';
		if(arr.length > 1){
			var his = this.extractHourMinuteSecond(arr[1]);
			if(null!=his){
				hh = his[0];
				mm = his[1];
				ss = his[2];
			}
		}
		if(!(arr.length > 1) && arr[0].length == 14){
			hh = arr[0].substring(8,10);
			mm = arr[0].substring(10,12);
			ss = arr[0].substring(12);
		}
		var dmy = this.extractDayMonthYear(arr[0],separator);
		return {day: dmy[0], month: dmy[1], year: dmy[2], hour: hh, minute: mm, second: ss};
	}
	
	dateToDateStr(date,separator){
		const m = this.leftZeros(date.getMonth() + 1,2);
		const d = this.leftZeros(date.getDate(),2);
		return  d + separator + m + separator + date.getFullYear() + ' ' + this.dateToHisString(date);
	}
	
	timeToDateStr(time: number,separator: string){
		return this.dateToDateStr(this.timeToDate(time),separator);
	}
	timeToDate(time: number){
		var d = new Date();
		d.setTime(time);
		return d;
	}
	timeFromForm(time){
		return this.leftZeros(time.hour,2) + ':' + this.leftZeros(time.minute,2) + ':' + this.leftZeros(time.second,2);
	}
	timeToForm(time: string){
		if(null==time){
			return {hour: 0, minute: 0, second: 0};
		}
		var arr = time.split(':');
		var h = parseInt(arr[0]);
		var m = parseInt(arr[1]);
		var s = parseInt(arr[2]);
		return {hour: h, minute: m, second: s};
	}
	
	getTimeMinutes(t){
		return (t.hour * 60) + t.minute;
	}
	
	getTimeSeconds(t){
		return (t.hour * 60 * 60) + (t.minute * 60) + t.second;
	}
	
	validateTimeInterval(ts,tf){
		var tfl = this.getTimeSeconds(tf);
		var tsl = this.getTimeSeconds(ts);
		return (tfl > tsl);
	}
	
	dateInSelectedWeekDays(date,arrWkd){
		if(undefined == arrWkd || null==arrWkd || date.getDay() >= arrWkd.length){
			return false;
		}
		var d = arrWkd[date.getDay()];
		return (d == true || d == 'true' || d == 1 || d == '1');
	}
	
	dayOfWeek(date: string){
		var t = this.valuesDateToInt(date,'-');
		var d = new Date();
		d.setFullYear(t.year, (t.month - 1), t.day);
		return d.getDay();
	}
	
	daysOfWeek(d){
		var week = [];
		d = this.firstDayWeek(d);
		for(var i = 0; i < 7; i++){
			week[i] = {
					day: this.leftZeros(d.getDate(),2),
					weekday: this.weekDays[i],
					month: this.months[d.getMonth()],
					year: d.getFullYear()
			};
			d = this.addDay(d);
		}
		return week;
	}
	
	firstDayWeek(d){
		while(d.getDay() > 0){
			d = this.subDay(d);
		}
		return d;
	}
	
	lastDayWeek(d){
		while(d.getDay() < 6){
    		d = this.addDay(d);
		}
		return d;
	}
	
	addDay(d){
		var t = d.getTime() + this.oneDayTime;
		d = new Date();
		d.setTime(t);
		return d;
	}
	
	subDay(d){
		var t = d.getTime() - this.oneDayTime;
		d = new Date();
		d.setTime(t);
		return d;
	}
	
	addWeek(d){
		var t = d.getTime() + (7 * this.oneDayTime);
		d = new Date();
		d.setTime(t);
		return d;
	}
	
	subWeek(d){
		var t = d.getTime() - (7 * this.oneDayTime);
		d = new Date();
		d.setTime(t);
		return d;
	}
	
	dateInInterval(date,ds,de){
		ds = this.subDay(ds);
		ds.setHours(23);
		ds.setMinutes(59);
		ds.setSeconds(59);
		de.setHours(23);
		de.setMinutes(59);
		de.setSeconds(59);
		if(date.getTime() < ds.getTime() || date.getTime() > de.getTime()){
			return false;
		}
		return true;
	}
	
	splitInterval(ds,de,ts,te){
		var tss = this.timeToForm(ts);
		var tes = this.timeToForm(te);
		var dMax = new Date();
		dMax.setTime(de.getTime());
		dMax.setHours(tes.hour);
		dMax.setMinutes(tes.minute);
		dMax.setSeconds(tes.second);
		var dStart = new Date();
		dStart.setTime(ds.getTime());
		dStart.setHours(tss.hour);
		dStart.setMinutes(tss.minute);
		dStart.setSeconds(tss.second);
		var dFinish = new Date();
		dFinish.setTime(ds.getTime());
		dFinish.setHours(tes.hour);
		dFinish.setMinutes(tes.minute);
		dFinish.setSeconds(tes.second);
		var dates = [];
		while(dStart.getTime() < dMax.getTime()){
			dates = [...dates,[dStart,dFinish]];
			dStart = this.addDay(dStart);
			dFinish = this.addDay(dFinish);
		}
		return dates;
	}
	
}

