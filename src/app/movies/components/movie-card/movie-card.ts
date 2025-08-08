import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Movie } from 'movies/models/movie.interface';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [MatCardModule, MatTooltipModule, MatIconModule, CommonModule],
  templateUrl: './movie-card.html',
  styleUrl: './movie-card.scss',
})
export class MovieCard {
  @Input() movie!: Movie;
}
