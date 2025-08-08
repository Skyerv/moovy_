import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Movie } from 'movies/models/movie.interface';
import { MovieDetailsDialog } from '../movie-details-dialog/movie-details-dialog';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [MatCardModule, MatTooltipModule, MatIconModule, CommonModule],
  templateUrl: './movie-card.html',
  styleUrl: './movie-card.scss',
})
export class MovieCard {
  @Input() movie!: Movie;

  constructor(private dialog: MatDialog, private router: Router) {}

  openMovieDialog(movieId: number, viaRoute = false): void {
    setTimeout(() => {
      if (!viaRoute) {
        this.router.navigate(['/movies', movieId, 'details']);
      }
    }, 300);

    const dialogRef = this.dialog.open(MovieDetailsDialog, {
      id: 'details-' + movieId,
      data: movieId,
      width: '600px',
      panelClass: 'custom-dialog-container',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['/movies']);
    });
  }
}
