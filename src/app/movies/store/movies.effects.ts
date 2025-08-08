import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as MoviesActions from './movies.actions';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { MovieService } from '../services/movie-service';

@Injectable()
export class MoviesEffects {
  actions$ = inject(Actions);
  
  constructor(private moviesService: MovieService) {}
  
  loadUpcomingMovies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MoviesActions.loadUpcomingMovies),
      mergeMap(() =>
        this.moviesService.getUpcomingMovies().pipe(
          map((movies) =>
            MoviesActions.loadUpcomingMoviesSuccess({ movies: movies.results })
          ),
          catchError((error) =>
            of(
              MoviesActions.loadUpcomingMoviesFailure({ error: error.message })
            )
          )
        )
      )
    )
  );
}
