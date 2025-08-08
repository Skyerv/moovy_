import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MoviesHub } from './pages/movies-hub/movies-hub';

const routes: Routes = [
  {
    path: '',
    component: MoviesHub,
  },
  {
    path: 'movies',
    component: MoviesHub,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MoviesRoutingModule {}
