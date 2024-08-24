import { AccountService } from './account-service.service';
import { Injectable } from '@angular/core';
import todoAbi from '../../../assets/contracts_abi/todo_abi.json';
import utilityAbi from '../../../assets/contracts_abi/utlity_abi.json';
import { AppConfig } from '../constants/appConfig';

@Injectable({
  providedIn: 'root',
})
export class TodoContractService {
  private contractAddress = AppConfig.todoContractAddress;
  private utilityContractAddress = AppConfig.utilityContractAddress;
  private todoContract: any;
  private utilityContract: any;

  gas = '200000';
  constructor(private accountService: AccountService) {
    this.todoContract = accountService.registerContract(
      todoAbi,
      this.contractAddress
    );
    this.utilityContract = accountService.registerContract(
      utilityAbi,
      this.utilityContractAddress
    );
  }

  public async getAccounts() {
    return await this.accountService.getAccounts();
  }

  async getAllListWithTasks(account: any) {
    return await this.todoContract.methods
      .GetAllListWithTasks()
      .call({ from: account });
  }

  async addNewList(account: any, name: string) {
    return await this.todoContract.methods
      .AddNewList(name)
      .send({ from: account, gas: this.gas });
  }

  async addNewListTask(listId: any, taskName: string, account: any) {
    return await this.todoContract.methods
      .AddNewListTask(listId, taskName)
      .send({ from: account, gas: this.gas });
  }

  async markTaskDone(
    listId: number,
    taskId: number,
    done: boolean,
    account: any
  ) {
    return await this.todoContract.methods
      .MarkTaskDone(listId, taskId, done)
      .send({ from: account });
  }

  async deleteList(listId: number, account: any) {
    return this.todoContract.methods
      .DeleteList(listId)
      .send({ from: account, gas: this.gas });
  }

  async deleteTaskFromList(listId: number, taskId: number, account: any) {
    return this.todoContract.methods
      .DeleteTaskFromList(listId, taskId)
      .send({ from: account, gas: this.gas });
  }

  async estimateGas(address: any) {
    const gasEstimate = await this.todoContract.methods
      .DeleteList(
        '0xe0cbcc3f5e76bff3ec3e86768cae94947cefe06d64994aedb5baed4cef547418'
      )
      .estimateGas({ from: address });

    console.log('Estimated gas:', gasEstimate);
  }
}
