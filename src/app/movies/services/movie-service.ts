import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  MovieSearchQuery,
  MovieSearchResponse,
  MovieDetails,
  UpcomingResponse,
} from '../models/movie.interface';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private http: HttpClient = inject(HttpClient);
  private apiKey = environment.tmdbApiKey;
  private baseUrl = environment.tmdbBaseUrl;

  constructor() {}

  searchMovies(query: MovieSearchQuery): Observable<MovieSearchResponse> {
    let params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('query', query.query);

    if (query.page) {
      params = params.set('page', query.page.toString());
    }

    if (query.include_adult !== undefined) {
      params = params.set('include_adult', query.include_adult.toString());
    }

    if (query.region) {
      params = params.set('region', query.region);
    }

    if (query.year) {
      params = params.set('year', query.year.toString());
    }

    if (query.primary_release_year) {
      params = params.set(
        'primary_release_year',
        query.primary_release_year.toString()
      );
    }

    // TODO: create new function to deal with this poster thing
    return this.http
      .get<MovieSearchResponse>(`${this.baseUrl}/search/movie`, { params })
      .pipe(
        map((res) => ({
          ...res,
          results: res.results.map((movie) => ({
            ...movie,
            poster_full_url: movie.poster_path
              ? `${environment.tmdbImageBaseUrl}${movie.poster_path}`
              : null,
            backdrop_full_url: movie.backdrop_path
              ? `${environment.tmdbImageBaseUrl}${movie.backdrop_path}`
              : null,
          })),
        }))
      );
  }

  getPopularMovies(page: number = 1) {
     let params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('page', page);

    return this.http
      .get<MovieSearchResponse>(
        `${this.baseUrl}/movie/popular`, { params }
      )
      .pipe(
        map((res) => ({
          ...res,
          results: res.results.map((movie) => ({
            ...movie,
            poster_full_url: movie.poster_path
              ? `${environment.tmdbImageBaseUrl}${movie.poster_path}`
              : null,
            backdrop_full_url: movie.backdrop_path
              ? `${environment.tmdbImageBaseUrl}${movie.backdrop_path}`
              : null,
          })),
        }))
      );
  }

  getUpcomingMovies(
    page: number = 1
  ): Observable<UpcomingResponse> {
    let params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('page', page);

    return this.http
      .get<UpcomingResponse>(
        `${this.baseUrl}/movie/upcoming`, { params }
      )
      .pipe(
        map((res) => ({
          ...res,
          results: res.results.map((movie) => ({
            ...movie,
            poster_full_url: movie.poster_path
              ? `${environment.tmdbImageBaseUrl}${movie.poster_path}`
              : null,
            backdrop_full_url: movie.backdrop_path
              ? `${environment.tmdbImageBaseUrl}${movie.backdrop_path}`
              : null,
          })),
        }))
      );
  }

  getMovieDetailsById(movieId: number): Observable<MovieDetails> {
    return this.http
      .get<MovieDetails>(
        `${this.baseUrl}/movie/${movieId}?api_key=${this.apiKey}`
      )
      .pipe(
        map((movie) => ({
          ...movie,
          poster_full_url: movie.poster_path
            ? `${environment.tmdbImageBaseUrl}${movie.poster_path}`
            : null,
          backdrop_full_url: movie.backdrop_path
            ? `${environment.tmdbImageBaseUrl}${movie.backdrop_path}`
            : null,
        }))
      );
  }

  getGuestSessionId() {
    return this.http.get<{ guest_session_id: string }>(
      `${this.baseUrl}/authentication/guest_session/new?api_key=${this.apiKey}`
    );
  }

  rateMovie(movieId: number, rating: number, sessionId: string) {
    return this.http.post(
      `${this.baseUrl}/movie/${movieId}/rating?api_key=${this.apiKey}&guest_session_id=${sessionId}`,
      { value: rating }
    );
  }
}
