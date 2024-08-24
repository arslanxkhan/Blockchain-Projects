import { Injectable } from '@angular/core';
import Web3, { AbiItem } from 'web3';
import { AppConfig } from '../constants/appConfig';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private web3: Web3;

  constructor() {
    this.web3 = new Web3(
      new Web3.providers.HttpProvider(AppConfig.blockchainNetworkUrl)
    );
  }

  public registerContract(abi: AbiItem[], contractAddress: string): any {
    var contract = new this.web3.eth.Contract(abi, contractAddress);
    return contract;
  }

  public async getAccounts() {
    return await this.web3.eth.getAccounts();
  }

  public async getAccountBalance(account: any) {
    var balance = await this.web3.eth.getBalance(account);
    return this.convertToEither(balance);
  }

  public convertToWei(value: any) {
    return this.web3.utils.toWei(value.toString(), 'ether');
  }

  public convertToEither(value: any) {
    return this.web3.utils.fromWei(value.toString(), 'ether');
  }
}
