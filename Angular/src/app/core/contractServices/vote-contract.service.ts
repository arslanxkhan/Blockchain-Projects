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

    console.log(voteAbi);
    console.log(this.contractAddress);
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
      const gasPrice = await this.accountService.getGasPrice(); // Get current gas price
      const gasEstimate = await this.votingContract.methods.AddVote(proposalIndex).estimateGas({ from: account }); // Estimate gas
  
      console.log("gasPrice",gasPrice)
      console.log("gasEstimate",gasEstimate)
      await this.votingContract.methods.AddVote(proposalIndex).send({
        from: account,
        gas: gasEstimate,
        gasPrice: gasPrice
      })
      .on('transactionHash', (hash:any) => {
        console.log('Transaction Hash:', hash);
      })
      .on('receipt', (receipt:any) => {
        console.log('Transaction Receipt:', receipt);
      });
    } catch (error: any) {
      console.error("Transaction error:", error.message);
      if (error.message.includes('You have already voted')) {
        alert('You have already voted for this proposal.');
      } else {
        alert('Transaction failed: ' + error.message);
      }
    }
  }
  
}
