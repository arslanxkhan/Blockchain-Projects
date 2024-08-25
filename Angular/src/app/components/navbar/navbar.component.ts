import { Router } from '@angular/router';
import { AppEventsService } from './../../core/services/app-events.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  constructor(
    private appEventsService: AppEventsService,
    private router: Router
  ) {}

  selectedAccount: { name: string } = { name: '' };
  accounts: { name: string }[] = [];
  metamaskInstalled: boolean = false;

  async ngOnInit() {
    this.metamaskInstalled = this.isMetamaskInstalled();

    this.appEventsService.accountList.subscribe((x) => {
      this.accounts = x;
      this.selectedAccount = x[0];
    });
  }

  onAccountChange(value: any) {
    this.appEventsService.SelectedAccount.emit(value.target.value);
  }

  goToHome() {
    this.accounts = [];

    setTimeout(() => {
      this.router.navigate(['/']);
    }, 50);
  }

  isMetamaskInstalled(): boolean {
    return typeof (window as any).ethereum !== 'undefined';
  }
}
