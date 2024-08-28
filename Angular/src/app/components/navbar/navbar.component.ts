import { Router } from '@angular/router';
import { AppEventsService } from './../../core/services/app-events.service';
import { Component, NgZone, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  constructor(
    private appEventsService: AppEventsService,
    private router: Router,
    private ngZone: NgZone
  ) {}

  selectedAccount: { name: string } = { name: '' };
  accounts: { name: string }[] = [];
  metamaskInstalled: boolean = false;

  async ngOnInit() {
    this.metamaskInstalled = this.isMetamaskInstalled();

    this.appEventsService.accountList.subscribe((x) => {
      this.accounts = x;
      this.selectedAccount = x[0];
      this.ngZone.run(() => {
        setTimeout(() => {
          this.appEventsService.SelectedAccount.emit(this.selectedAccount);
        }, 10);
      });
      this.appEventsService.setSelectedAccount(this.selectedAccount);
    });
  }

  onAccountChange(value: any) {
    var account = value.target.value;
    this.appEventsService.SelectedAccount.emit(account);
    this.appEventsService.setSelectedAccount(account);
  }

  goToHome() {
    // this.accounts = [];
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 50);
  }

  isMetamaskInstalled(): boolean {
    return typeof (window as any).ethereum !== 'undefined';
  }
}
