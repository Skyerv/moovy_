import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialSharedModule } from '../shared/material-shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { routes } from '../app.routes';
import { MoviesHub } from './pages/movies-hub/movies-hub';
import { StoreModule } from '@ngrx/store';
import { moviesReducer } from './store/movies.reducer';
import { MoviesRoutingModule } from './movies-routing.module';
import { EffectsModule } from '@ngrx/effects';
import { MoviesEffects } from './store/movies.effects';
import { MovieCard } from './components/movie-card/movie-card';

@NgModule({
  declarations: [MoviesHub],
  imports: [
    CommonModule,
    MoviesRoutingModule,
    StoreModule.forRoot({ movies: moviesReducer }),
    StoreModule.forFeature('movies', moviesReducer),
    EffectsModule.forRoot([MoviesEffects]),
    MaterialSharedModule,
    BrowserAnimationsModule,
    MovieCard,
  ],
})
export class MoviesModule {}
