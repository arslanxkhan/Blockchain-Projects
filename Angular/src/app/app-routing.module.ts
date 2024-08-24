import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },

  {
    path: 'vote',
    loadChildren: () =>
      import('./pages/vote/vote.module').then((m) => m.VoteModule),
  },
  {
    path: 'todo',
    loadChildren: () =>
      import('./pages/todo/todo.module').then((m) => m.TodoModule),
  },

  {
    path: 'lottery',
    loadChildren: () =>
      import('./pages/lottery/lottery.module').then((m) => m.LotteryModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
