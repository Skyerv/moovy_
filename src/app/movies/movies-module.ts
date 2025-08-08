import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialSharedModule } from '../shared/material-shared.module';
import { MoviesHub } from './pages/movies-hub/movies-hub';
import { MoviesRoutingModule } from './movies-routing.module';
import { MovieCard } from './components/movie-card/movie-card';
import { Carousel } from './components/carousel/carousel';
import { MovieDetailsDialog } from './components/movie-details-dialog/movie-details-dialog';

@NgModule({
  declarations: [MoviesHub],
  imports: [
    CommonModule,
    MoviesRoutingModule,
    MaterialSharedModule,
    MovieCard,
    Carousel,
    MovieDetailsDialog,
  ],
})
export class MoviesModule {}
