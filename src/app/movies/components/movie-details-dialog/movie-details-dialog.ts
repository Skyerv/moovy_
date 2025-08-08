import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MovieService } from '../../services/movie-service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {
  MovieCreditsResponse,
  MovieDetails,
} from '../../models/movie.interface';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-movie-details-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    FormsModule,
    MatDividerModule,
    MatSnackBarModule,
  ],
  templateUrl: './movie-details-dialog.html',
  styleUrl: './movie-details-dialog.scss',
})
export class MovieDetailsDialog {
  @ViewChild('actorsRowRef', { static: false })
  actorsRowRef!: ElementRef<HTMLDivElement>;

  movieDetails$!: Observable<MovieDetails>;
  movieCastAndCrew$!: Observable<MovieCreditsResponse>;

  scrollAmount = 200;

  constructor(
    @Inject(MAT_DIALOG_DATA) public movieId: number,
    private dialogRef: MatDialogRef<MovieDetailsDialog>,
    private movieService: MovieService
  ) {}

  ngOnInit(): void {
    this.getMovieDetails();
  }

  onClose() {
    this.dialogRef.close();
  }

  getMovieDetails(): void {
    this.movieDetails$ = this.movieService.getMovieDetailsById(this.movieId);
    this.movieCastAndCrew$ = this.movieService.getMovieCreditsById(
      this.movieId
    );
  }

  getProfileImage(path: string | null): string {
    return path
      ? `${environment.tmdb200ImageBaseUrl}${path}`
      : 'assets/default-avatar-icon.jpg';
  }

  scrollActors(direction: 'left' | 'right') {
    if (!this.actorsRowRef) return;

    const container = this.actorsRowRef.nativeElement;
    const scrollDistance =
      direction === 'left' ? -this.scrollAmount : this.scrollAmount;

    container.scrollBy({ left: scrollDistance, behavior: 'smooth' });
  }
}
