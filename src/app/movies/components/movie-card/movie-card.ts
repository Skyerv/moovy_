import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Movie } from 'movies/models/movie.interface';
import { MovieDetailsDialog } from '../movie-details-dialog/movie-details-dialog';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [MatCardModule, MatTooltipModule, MatIconModule, CommonModule],
  templateUrl: './movie-card.html',
  styleUrl: './movie-card.scss',
})
export class MovieCard {
  @Input() movie!: Movie;

  constructor(private dialog: MatDialog) {}

  openMovieDialog(movieId: number, viaRoute = false): void {
    // I had to take out the logic of making the dialog open in
    // a new route because it was causing an error that I could
    // not figure out.

    // Maybe if I put the movies into a NgRx Store it would help,
    // I'll check this later.

    // If you want to see the routing logic working,
    // just un-comment the code lines below.

    // The routing logic will work, but some other stuff will break.

    setTimeout(() => {
      if (!viaRoute) {
        //this.router.navigate(['/movies', movieId, 'details']);
      }
    }, 300);

    const dialogRef = this.dialog.open(MovieDetailsDialog, {
      id: 'details-' + movieId,
      data: movieId,
      width: '600px',
      panelClass: 'custom-dialog-container',
    });

    dialogRef.afterClosed().subscribe(() => {
      //this.router.navigate(['/movies']);
    });
  }
}
