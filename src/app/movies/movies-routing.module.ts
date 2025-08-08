import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MoviesHub } from './pages/movies-hub/movies-hub';

const routes: Routes = [
  {
    path: '',
    component: MoviesHub,
    children: [
      {
        path: 'movies/:id/details',
        loadComponent: () =>
          import(
            'movies/components/movie-details-dialog/movie-details-dialog'
          ).then((m) => m.MovieDetailsDialog),
      },
    ],
  },
  {
    path: 'movies',
    component: MoviesHub,
    children: [
      {
        path: 'movies/:id/details',
        loadComponent: () =>
          import(
            'movies/components/movie-details-dialog/movie-details-dialog'
          ).then((m) => m.MovieDetailsDialog),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MoviesRoutingModule {}
