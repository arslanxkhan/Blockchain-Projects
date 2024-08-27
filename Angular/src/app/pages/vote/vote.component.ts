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
  accountPrivateKey: any =
    'private key of selected account';

  constructor(
    private voteContractService: VoteContractService,
    private appEventsService: AppEventsService
  ) {}

  async ngOnInit() {
    this.proposals = await this.voteContractService.getProposals();

    var accounts: string[] = [];
    accounts = await this.voteContractService.getAccounts();
    this.account = accounts[0];

    console.log(accounts)
    this.appEventsService.accountList.emit(accounts);

    this.appEventsService.SelectedAccount.subscribe((x) => {
      this.account = x;
    });
  }

  async vote(proposalIndex: number) {
    await this.voteContractService.vote(proposalIndex, this.account);

    //below line is use when you want to connect with 3rd party like Alchmey 
    // await this.voteContractService.sendSignedTransaction(proposalIndex, this.account, this.accountPrivateKey);
    this.proposals = await this.voteContractService.getProposals(); // Refresh proposals
  }
}
