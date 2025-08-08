import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MoviesHub } from './pages/movies-hub/movies-hub';
import { MovieDetailsDialog } from './components/movie-details-dialog/movie-details-dialog';

const routes: Routes = [
  {
    path: '',
    component: MoviesHub,
    children: [{ path: 'movies/:id/details', component: MovieDetailsDialog }],
  },
  {
    path: 'movies',
    component: MoviesHub,
    children: [{ path: 'movies/:id/details', component: MovieDetailsDialog }],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MoviesRoutingModule {}
