import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LotteryComponent } from './lottery.component';
import { LotteryRoutingModule } from './todo-routing.module';

@NgModule({
  declarations: [LotteryComponent],
  imports: [LotteryRoutingModule, CommonModule, FormsModule],
  exports: [LotteryComponent],
})
export class LotteryModule {}
