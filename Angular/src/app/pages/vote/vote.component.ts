import { AppEventsService } from './../../core/services/app-events.service';
import { AccountService } from './../../core/contractServices/account-service.service';
import { Component, OnInit } from '@angular/core';
import { VoteContractService } from 'src/app/core/contractServices/vote-contract.service';
import { AppConfig } from 'src/app/core/constants/appConfig';

@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.css'],
})
export class VoteComponent implements OnInit {
  proposals: any[] = [];
  account: string = '';

  constructor(
    private voteContractService: VoteContractService,
    private appEventsService: AppEventsService
  ) {}

  async ngOnInit() {
    this.proposals = await this.voteContractService.getProposals();

    var accounts: string[] = [];
    switch (AppConfig.enviroment) {
      case 'prod':
        accounts = await (window as any).ethereum.request({
          method: 'eth_requestAccounts',
        });
        this.account = accounts[0];
        break;

      default:
        accounts = await this.voteContractService.getAccounts();
        this.account = accounts[0];
        break;
    }

    this.appEventsService.accountList.emit(accounts);

    this.appEventsService.SelectedAccount.subscribe((x) => {
      this.account = x;
    });
  }

  async vote(proposalIndex: number) {
    await this.voteContractService.vote(proposalIndex, this.account);
    this.proposals = await this.voteContractService.getProposals(); // Refresh proposals
  }
}
