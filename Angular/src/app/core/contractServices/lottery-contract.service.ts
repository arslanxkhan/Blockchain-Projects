import { AccountService } from './account-service.service';
import { Injectable } from '@angular/core';
import lotteryAbi from '../../../assets/contracts_abi/lottery_abi.json';
import { AppConfig } from '../constants/appConfig';

@Injectable({
  providedIn: 'root',
})
export class LotteryContractService {
  lotteryContractAddress = AppConfig.lotteryContractAddress;
  lotteryContract: any;

  constructor(private accountService: AccountService) {
    this.lotteryContract = accountService.registerContract(
      lotteryAbi,
      this.lotteryContractAddress
    );
  }

  async getAccounts() {
    return await this.accountService.getAccounts();
  }

  public async getAccountBalance(account: any) {
    return await this.accountService.getAccountBalance(account);
  }

  async getParaticipants() {
    return await this.lotteryContract.methods.GetParticipants().call();
  }

  async getTicketCounts(account: any) {
    return await this.lotteryContract.methods.GetTicketsCount(account).call();
  }

  async getTicketPrice() {
    var price = await this.lotteryContract.methods.GetTicketPrice().call();
    return await this.accountService.convertToEither(price);
  }

  async buyTickets(account: any, amount: any) {
    try {
   var price = this.accountService.convertToWei(amount);
    console.log("ToWei: ", price);
    const gasPrice = await this.accountService.getGasPrice();
    const gasEstimate = await this.lotteryContract.methods
      .BuyTickets()
      .estimateGas({ from: account });

  
      return await this.lotteryContract.methods
        .BuyTickets()
        .send({
          from: account,
          value: price,
          gas: gasEstimate,
          gasPrice: gasPrice,
        });
    } catch (error: any) {
      console.error(error);
    }
  }

  async drawWinner(account: any) {
    try {
      return await this.lotteryContract.methods
        .DrawWinner()
        .send({ from: account, gas: '200000' });
    } catch (error) {
      console.error(error);
    }
  }

  async isOwner(account: any) {
    const ownerAddress = await this.lotteryContract.methods.owner().call();
    return ownerAddress.toLowerCase() === account.toLowerCase();
  }
}
