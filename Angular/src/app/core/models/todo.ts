export interface UserTodoListDto {
  List: TodoListDto;
  TaskName: string;
  Task: TodoListTaskDto[];
}

export interface TodoListDto {
  Id: any;
  Name: string;
}

export interface TodoListTaskDto {
  Id: any;
  Task: string;
  Done: boolean;
}
