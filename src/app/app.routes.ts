import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('movies/movies-module').then(m => m.MoviesModule),
  },
  {
    path: 'movies',
    loadChildren: () =>
      import('movies/movies-module').then(m => m.MoviesModule),
  },
];
