import { createSelector, createFeatureSelector } from '@ngrx/store';
import { MoviesState } from './movies.state';
import { Movie } from 'movies/models/movie.interface';

export const selectMoviesState = createFeatureSelector<MoviesState>('movies');

// export const selectAllMovies = createSelector(
//   selectMoviesState,
//   (state) => state.movies
// );

// export const selectLoading = createSelector(
//   selectMoviesState,
//   (state) => state.loading
// );

// export const selectError = createSelector(
//   selectMoviesState,
//   (state) => state.error
// );

// export const selectSelectedMovieId = createSelector(
//   selectMoviesState,
//   (state) => state.selectedMovieId
// );

// export const selectSelectedMovie = createSelector(
//   selectMoviesState,
//   selectSelectedMovieId,
//   (state, selectedId) => state.movies.find(movie => movie.id === selectedId) || null
// );

export const selectUpcomingMovies = createSelector(
  selectMoviesState,
  (state: MoviesState) => state.movies
);