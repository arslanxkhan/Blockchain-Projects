import { AccountService } from './account-service.service';
import { Injectable } from '@angular/core';
import voteAbi from '../../../assets/contracts_abi/vote_abi.json';
import { AppConfig } from '../constants/appConfig';

@Injectable({
  providedIn: 'root',
})
export class VoteContractService {
  private contractAddress = AppConfig.voteSystemContractAddress;
  private votingContract: any;

  constructor(private accountService: AccountService) {
    this.votingContract = accountService.registerContract(
      voteAbi,
      this.contractAddress
    );
  }

  public async getAccounts() {
    return await this.accountService.getAccounts();
  }

  async getProposals() {
    return await this.votingContract.methods.getProposals().call();
  }

  async getProposalByIndex(index: number) {
    return await this.votingContract.methods.getProposalByIndex(index).call();
  }

  async vote(proposalIndex: number, account: string) {
    try {
      await this.votingContract.methods.vote(proposalIndex).send({
        from: account,
      });
    } catch (error: any) {
      if (error.message.includes('You have already voted')) {
        alert('You have already voted for this proposal.');
      }
      console.error(error);
    }
  }
}
