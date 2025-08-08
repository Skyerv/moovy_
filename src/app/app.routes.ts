import { Routes } from '@angular/router';
import { MovieDetailsDialog } from 'movies/components/movie-details-dialog/movie-details-dialog';
import { MoviesHub } from 'movies/pages/movies-hub/movies-hub';

export const routes: Routes = [
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
