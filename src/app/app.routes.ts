import { Routes } from '@angular/router';
import { MoviesHub } from 'movies/pages/movies-hub/movies-hub';

export const routes: Routes = [
  {
    path: '',
    component: MoviesHub,
  },
  {
    path: 'home',
    component: MoviesHub,
  },
];
