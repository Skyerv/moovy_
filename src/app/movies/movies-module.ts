import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialSharedModule } from '../shared/material-shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { routes } from '../app.routes';
import { MoviesHub } from './pages/movies-hub/movies-hub';

@NgModule({
  declarations: [MoviesHub],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
    MaterialSharedModule,
    BrowserAnimationsModule,
  ],
})
export class MoviesModule {}
