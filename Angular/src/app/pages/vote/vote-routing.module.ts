import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VoteComponent } from './vote.component';

const routes: Routes = [
  {
    path: '',
    component: VoteComponent,
    title:"Voting System"
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VoteRoutingModule {}
