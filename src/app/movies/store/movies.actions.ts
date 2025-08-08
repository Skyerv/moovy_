import { createAction, props } from '@ngrx/store';
import { Movie } from '../models/movie.interface';

export const loadMovies = createAction('[Movies] Load Movies');

export const loadMoviesSuccess = createAction(
  '[Movies] Load Movies Success',
  props<{ movies: Movie[] }>()
);

export const loadMoviesFailure = createAction(
  '[Movies] Load Movies Failure',
  props<{ error: string }>()
);

export const loadUpcomingMovies = createAction('[Movies] Load Upcoming Movies');

export const loadUpcomingMoviesSuccess = createAction(
  '[Movies] Load Upcoming Movies Success',
  props<{ movies: Movie[] }>()
);

export const loadUpcomingMoviesFailure = createAction(
  '[Movies] Load Upcoming Movies Failure',
  props<{ error: string }>()
);

export const selectMovie = createAction(
  '[Movies] Select Movie',
  props<{ movieId: number }>()
);
