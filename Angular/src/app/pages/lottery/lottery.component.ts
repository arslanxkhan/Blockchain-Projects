import { AppEventsService } from './../../core/services/app-events.service';
import { LotteryContractService } from './../../core/contractServices/lottery-contract.service';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AppConfig } from 'src/app/core/constants/appConfig';

@Component({
  selector: 'app-lottery',
  templateUrl: './lottery.component.html',
  styleUrls: ['./lottery.component.css'],
})
export class LotteryComponent implements OnInit {
  account: any;
  paraticipants: any;
  totalTickets: number = 0;
  ticketPrice: string = '';
  ticketAmount: number = 1;
  isOwner: boolean = false;
  statusMessage: string = '';
  currentBalance: any;

  constructor(
    private lotteryContractService: LotteryContractService,
    private appEventsService: AppEventsService
  ) {}

  async ngOnInit() {
    this.appEventsService.SelectedAccount.subscribe(async (x) => {
      this.account = x;
      this.isOwner = await this.lotteryContractService.isOwner(this.account);
      await this.updateData();
    });

    var account = this.appEventsService.getSelectedAccount();
    if (account) {
      this.account = account;
      await this.updateData();
    }
    this.isOwner = await this.lotteryContractService.isOwner(this.account);
  }

  async updateData() {
    await this.getTicketPrice();
    await this.getTicketCounts();
    await this.getAccountBalance();
    await this.getParaticipants();
  }

  async getParaticipants() {
    this.paraticipants = await this.lotteryContractService.getParaticipants();
    this.paraticipants = [...new Set(this.paraticipants)];
  }

  async getTicketCounts() {
    this.totalTickets = await this.lotteryContractService.getTicketCounts(
      this.account
    );
  }

  async getTicketPrice() {
    this.ticketPrice = await this.lotteryContractService.getTicketPrice();
  }

  public async getAccountBalance() {
    this.currentBalance = await this.lotteryContractService.getAccountBalance(
      this.account
    );
  }

  async buyTickets(amount: any) {
    try {
      await this.lotteryContractService.buyTickets(this.account, amount);
      this.statusMessage = 'Tickets purchased successfully!';
    } catch (error) {
      this.statusMessage = 'Failed to purchase tickets.';
    }

    await this.updateData();
  }

  async drawWinner() {
    try {
      await this.lotteryContractService.drawWinner(this.account);
      this.statusMessage = 'Winner has been drawn!';
    } catch (error) {
      this.statusMessage = 'Failed to draw winner.';
    }
  }
}
