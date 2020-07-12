import { Injectable } from '@angular/core';
import { DateService } from '../date/date.service';

@Injectable({providedIn: 'root'})
export class CalendarDrawer {
	
	hasEvents: boolean;
	dateService: DateService;
    maxColors: number = 20;
    lgIds: any[];

	setDateService(dateService: DateService){
		this.dateService = dateService;
	}
	
	private classEventInHour(evHs,evMs,evHf,evMf,h,m){
		if(h > evHs && h < evHf){
			return 'calWBColEvM';
		}
		if(h == evHs && h == evHf){
			if(m < evMs || m > evMf){
				return null;
			}
			if(m == evMs){
				return 'calWBColEvT';
			}
			if(m == evMf){
				return 'calWBColEvB';
			}
			return 'calWBColEvM';
		}
		if(h == evHs){
			if(m < evMs){
				return null;
			}
			if(m == evMs){
				return 'calWBColEvT';
			}
			return 'calWBColEvM';
		}
		if(h == evHf){
			if(m > evMf){
				return null;
			}
			if(m == evMf){
				return 'calWBColEvB';
			}
			return 'calWBColEvM';
		}
		return null;
	}
	
	private getHeader(week){
		var header = '<div class="calH">';
		header += week[0].day + ' de ' + week[0].month + ' de ' + week[0].year;
		header += ' à ';
		header += week[6].day + ' de ' + week[6].month + ' de ' + week[6].year;
		header += '</div>';
		return header;
	}
	
	private getWeekHeader(week){
		var wheader = '<div class="calWH">';
		wheader += '<div class="calWHColH empty">.</div>';
		for(var i = 0; i < 7; i++){
			wheader += '<div class="calWHColD">';
			wheader += '<div class="calWHColDd c' + i + '">';
			wheader += week[i].day;
			wheader += '</div>';
			wheader += '<div class="calWHColDwd c' + i + '">';
			wheader += week[i].weekday;
			wheader += '</div>';
			wheader += '</div>';
		}
		wheader += '<div class="clear"></div>';
		wheader += '</div>';
		return wheader;
	}
	
	private getLegendWkD(events,wkd){
		var wleg = '';
		if(undefined==events || null==events){
			return wleg;
		}
		for(var k = 0; k < events.length; k++){
			if(this.lgIds.includes(events[k].id)){
				continue;
			}
			var c = events[k].color
			var evtag = (c == 2000) ? '[T] ' : ((c == 3000) ? '[E] ' : (c == 4000 ? '[I/M/A] ' : ''));
			wleg += '<div class="calWLegC ev_color_' + c + '_border">';
			wleg += '<div class="calWLegM ev_color_' + c + ' empty">.</div>';
			wleg += '<div class="calWLegT">' + evtag + events[k].title + '</div>';
			wleg += '<div class="clear"></div>';
			wleg += '</div>';
			this.lgIds = [...this.lgIds,events[k].id];
		}
		return wleg;
	}
	
	private getLegend(events){
		var wleg = '<div class="calWLeg">';
		if(!this.hasEvents){
			wleg += '<div class="calWLegInfo">Não há registros para a semana.</div>';
			wleg += '</div>';
			return wleg;
		}
		for(var i = 0; i < 7; i++){
			if(events.length <= i){
				break;
			}
			wleg += this.getLegendWkD(events[i],i);
		}
		wleg += '<div class="clear"></div>';
		wleg += '<div class="calWLegInfo">* [T] = Tipo Tarefa, [E] = Tipo participação em Evento/Atividade,';
		wleg += ' [I/M/A] = Tipo Indisponibilidade/Manutenção ou Ausência programadas.</div>';
		wleg += '<div class="clear"></div>';
		wleg += '</div>';
		return wleg;
	}
	
	private getTimeCol(hrows){
		var wrow = '<div class="calWBColH">';
		for(var i = 0; i < hrows.length; i++){
			wrow += '<div class="calWBColSeg calRow' + (i%2) + '">';
			wrow += '<span>';
			wrow += this.dateService.leftZeros(hrows[i].hour,2) + ':' + this.dateService.leftZeros(hrows[i].minute,2);
			wrow += '</span>';
			wrow += '</div>';
			wrow += '<div class="clear"></div>';
		}
		wrow += '</div>';
		return wrow;
	}
	
	private getWkdEventCol(event,hrow,wkd,evn){
		var wrow = '<div class="calWBColEv">';
		var clazz = this.classEventInHour(event.hs,event.ms,event.hf,event.mf,hrow.hour,hrow.minute);
		if(null!=clazz){
			this.hasEvents = true;
			wrow += '<div class="' + clazz + ' ev_color_' + event.color + ' empty">.</div>';
		}
		wrow += '</div>';
		return wrow;
	}
	
	private getEmptyWeekDayEventsCol(hrows){
		var wrow = '<div class="calWBColD">';
		for(var i = 0; i < hrows.length; i++){
			wrow += '<div class="calWBColSeg calRow' + (i%2) + '"></div>';
			wrow += '<div class="clear"></div>';
		}
		wrow += '</div>';
		return wrow;
	}
	
	private getWeekDayEventsColForHRow(events,hrow,wkd,hrn){
		var wrow = '<div class="calWBColSeg calRow' + (hrn%2) + '">';
		for(var k = 0; k < events.length; k++){
			wrow += this.getWkdEventCol(events[k],hrow,wkd,k);
		}
		wrow += '<div class="clear"></div>';
		wrow += '</div>';
		wrow += '<div class="clear"></div>';
		return wrow;
	}
	
	private getWeekDayEventsCol(events,hrows,wkd){
		if(undefined==events || null==events){
			return this.getEmptyWeekDayEventsCol(hrows);
		}
		var wrow = '<div class="calWBColD">';
		for(var j = 0; j < hrows.length; j++){
			wrow += this.getWeekDayEventsColForHRow(events,hrows[j],wkd,j);
		}
		wrow += '</div>';
		return wrow;
	}
	
	private prepareColors(events){
		for(var k = 0; k < events.length; k++){
			if(events[k].color < 1000){
				events[k].color = events[k].color%this.maxColors;
			}
		}
		return events;
	}
	
	generateEventsWeek(d,hrows,events){
		if(null==this.dateService){
			return '';
		}
		events = this.prepareColors(events);
		this.hasEvents = false;
		this.lgIds = [];
		var week = this.dateService.daysOfWeek(d);
		var wrow = '<div class="calWB">';
		wrow += this.getTimeCol(hrows);
		for(var i = 0; i < 7; i++){
			if(events.length <= i){
				break;
			}
			wrow += this.getWeekDayEventsCol(events[i],hrows,i);
		}
		wrow += '<div class="clear"></div>';
		wrow += '</div>';
		return '<div class="calC">' + this.getHeader(week) + this.getWeekHeader(week) + wrow + this.getLegend(events) + '</div>';
	}

	
}