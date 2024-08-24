import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppEventsService {

  constructor() { }

  accountList:EventEmitter<any>= new EventEmitter<any>();
  SelectedAccount:EventEmitter<any>= new EventEmitter<any>();

  
}
