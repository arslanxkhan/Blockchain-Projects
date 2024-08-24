import { UserTodoListDto } from 'src/app/core/models/todo';
import { TodoContractService } from './../../core/contractServices/todo-contract.service';
import { AppEventsService } from './../../core/services/app-events.service';
import { Component, OnInit } from '@angular/core';
import { AppConfig } from 'src/app/core/constants/appConfig';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css'],
})
export class TodoComponent implements OnInit {
  todoList: UserTodoListDto[] = [];
  account: string = '';
  listName: string = '';
  taskName: string = '';

  constructor(
    private todoContractService: TodoContractService,
    private appEventsService: AppEventsService
  ) {}

  async ngOnInit() {
    var accounts: string[] = [];
    switch (AppConfig.enviroment) {
      case 'prod':
        accounts = await (window as any).ethereum.request({
          method: 'eth_requestAccounts',
        });
        this.account = accounts[0];
        break;

      default:
        accounts = await this.todoContractService.getAccounts();
        this.account = accounts[0];
        break;
    }
    this.appEventsService.accountList.emit(accounts);

    this.appEventsService.SelectedAccount.subscribe(async (x) => {
      this.account = x;
      await this.getAllList();
    });

    await this.getAllList();
  }

  async getAllList() {
    this.todoList = await this.todoContractService.getAllListWithTasks(
      this.account
    );

    this.todoList = this.todoList.filter(
      (x) =>
        x.List.Id !=
        '0x0000000000000000000000000000000000000000000000000000000000000000'
    );
    console.log(this.todoList);
  }

  async addNewList() {
    if (this.listName == null || this.listName == '' || this.listName == ' ') {
      alert('please enter list name');
      return;
    }

    var res = await this.todoContractService.addNewList(
      this.account,
      this.listName
    );
    this.listName = '';
    await this.getAllList();
  }

  async addNewListTask(item: any) {
    await this.todoContractService.addNewListTask(
      item.List.Id,
      item.TaskName,
      this.account
    );

    this.taskName = '';
    await this.getAllList();
  }

  async deleteTask(listId: any, taskId: any) {
    await this.todoContractService.deleteTaskFromList(
      listId,
      taskId,
      this.account
    );
    await this.getAllList();
  }

  async deleteList(listId: any) {
    await this.todoContractService.deleteList(listId, this.account);
    await this.getAllList();
  }

  async markDone(listId: any, taskId: any, event: any) {
    const checkbox = event.target as HTMLInputElement;
    await this.todoContractService.markTaskDone(
      listId,
      taskId,
      checkbox.checked,
      this.account
    );
  }
}
