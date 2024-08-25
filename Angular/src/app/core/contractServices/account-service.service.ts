import { Injectable, OnInit } from '@angular/core';
import Web3, { AbiItem } from 'web3';
import { AppConfig } from '../constants/appConfig';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private web3: Web3;
  isRequestingAccount = false;
  accounts: string[] = [];

  constructor() {
    this.web3 = new Web3(AppConfig.blockchainNetworkUrl);
    this.web3.eth.handleRevert = true;
    console.log(AppConfig.blockchainNetworkUrl);
    this.connectWallet();
  }

  async connectWallet() {
    if (this.isRequestingAccount) {
      console.log('Already processing account request');
      return;
    }

    if ((window as any).ethereum) {
      this.isRequestingAccount = true;
      try {
        switch (AppConfig.enviroment) {
          case 'prod':
            this.accounts = await (window as any).ethereum.request({
              method: 'eth_requestAccounts',
            });
            break;

          default:
            this.accounts = await this.getAccounts();
            break;
        }

        console.log('Connected account:', this.accounts[0]);
      } catch (error) {
        console.error('Error connecting to wallet:', error);
      } finally {
        this.isRequestingAccount = false;
      }
    } else {
      console.log('Ethereum wallet not detected');
    }
  }

  public registerContract(abi: AbiItem[], contractAddress: string): any {
    var contract = new this.web3.eth.Contract(abi, contractAddress);
    return contract;
  }

  public getAccounts() {
    return this.accounts;
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

  public async getGasPrice() {
    return await this.web3.eth.getGasPrice();
  }
}
