import { NgModule } from '@angular/core';
import { VoteComponent } from './vote.component';
import { VoteRoutingModule } from './vote-routing.module';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [VoteComponent],
  imports: [VoteRoutingModule, CommonModule],
  exports: [VoteComponent],
})
export class VoteModule {}
