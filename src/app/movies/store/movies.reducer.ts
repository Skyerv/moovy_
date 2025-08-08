import { createReducer, on } from '@ngrx/store';
import { loadMovies, loadMoviesSuccess, loadMoviesFailure, selectMovie, loadUpcomingMovies, loadUpcomingMoviesSuccess, loadUpcomingMoviesFailure } from './movies.actions';
import { initialState } from './movies.state';

export const moviesReducer = createReducer(
  initialState,
  on(loadMovies, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(loadMoviesSuccess, (state, { movies }) => ({
    ...state,
    movies,
    loading: false,
  })),
  on(loadMoviesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
   on(loadUpcomingMovies, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(loadUpcomingMoviesSuccess, (state, { movies }) => ({
    ...state,
    movies,
    loading: false,
  })),
  on(loadUpcomingMoviesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(selectMovie, (state, { movieId }) => ({
    ...state,
    selectedMovieId: movieId,
  }))
);
