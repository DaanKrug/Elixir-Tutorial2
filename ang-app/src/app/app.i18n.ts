import { Injectable } from '@angular/core';
import { NgbDatepickerI18n, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap'; 

const I18N_VALUES = {
	'pt': {
		weekdays: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
		months: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    }
    // other languages you would support
};
@Injectable({providedIn: 'root'})
export class I18n {
	language = 'pt';
}
@Injectable({providedIn: 'root'})
export class CustomDatepickerI18n extends NgbDatepickerI18n {
    constructor(private _i18n: I18n) {
    	super();
    }
    getWeekdayShortName(weekday: number): string {
    	return I18N_VALUES[this._i18n.language].weekdays[weekday - 1];
    }
    getMonthShortName(month: number): string {
    	return I18N_VALUES[this._i18n.language].months[month - 1];
    }
    getMonthFullName(month: number): string {
    	return this.getMonthShortName(month);
    }
    getDayAriaLabel(date: NgbDateStruct): string {
    	return `${date.day}-${date.month}-${date.year}`;
    }
}