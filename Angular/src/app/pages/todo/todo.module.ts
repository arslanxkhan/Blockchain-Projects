import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { TodoRoutingModule } from './todo-routing.module';
import { CommonModule } from '@angular/common';
import { TodoComponent } from './todo.component';

@NgModule({
  declarations: [TodoComponent],
  imports: [TodoRoutingModule, CommonModule, FormsModule],
  exports: [TodoComponent],
})
export class TodoModule {}
