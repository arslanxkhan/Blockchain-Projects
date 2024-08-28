import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppEventsService {
  constructor() {}

 private selectedAccount: string = '';

  getSelectedAccount() {
    return this.selectedAccount;
  }

  setSelectedAccount(account: any) {
    this.selectedAccount = account;
  }
  accountList: EventEmitter<any> = new EventEmitter<any>();
  SelectedAccount: EventEmitter<any> = new EventEmitter<any>();
}
