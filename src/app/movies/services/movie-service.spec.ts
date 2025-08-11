import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import {
  MovieSearchQuery,
  MovieSearchResponse,
  UpcomingResponse,
  MovieDetails,
  MovieCreditsResponse,
} from '../models/movie.interface';
import { MovieService } from './movie-service';

describe('MovieService', () => {
  let service: MovieService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MovieService],
    });

    service = TestBed.inject(MovieService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should search movies and map poster/backdrop urls', () => {
    const query: MovieSearchQuery = { query: 'Matrix', page: 1 };
    const mockResponse: MovieSearchResponse = {
      page: 1,
      total_pages: 1,
      total_results: 1,
      results: [
        {
          id: 1,
          title: 'Matrix',
          poster_path: '/poster.jpg',
          backdrop_path: '/backdrop.jpg',
        } as any,
      ],
    };

    service.searchMovies(query).subscribe((res) => {
      expect(res.results[0].poster_full_url).toBe(
        `${environment.tmdbImageBaseUrl}/poster.jpg`
      );
      expect(res.results[0].backdrop_full_url).toBe(
        `${environment.tmdbImageBaseUrl}/backdrop.jpg`
      );
    });

    const req = httpMock.expectOne(
      (r) =>
        r.method === 'GET' &&
        r.url === `${environment.tmdbBaseUrl}/search/movie`
    );
    expect(req.request.params.get('query')).toBe('Matrix');
    expect(req.request.params.get('page')).toBe('1');
    req.flush(mockResponse);
  });

  it('should get popular movies and map urls', () => {
    const mockResponse: MovieSearchResponse = {
      page: 1,
      total_pages: 1,
      total_results: 1,
      results: [
        {
          id: 2,
          title: 'Popular Movie',
          poster_path: '/pop_poster.jpg',
          backdrop_path: '/pop_backdrop.jpg',
        } as any,
      ],
    };

    service.getPopularMovies(2).subscribe((res) => {
      expect(res.results[0].poster_full_url).toBe(
        `${environment.tmdbImageBaseUrl}/pop_poster.jpg`
      );
      expect(res.results[0].backdrop_full_url).toBe(
        `${environment.tmdbImageBaseUrl}/pop_backdrop.jpg`
      );
    });

    const req = httpMock.expectOne(
      (r) =>
        r.method === 'GET' &&
        r.url === `${environment.tmdbBaseUrl}/movie/popular`
    );
    expect(req.request.params.get('page')).toBe('2');
    req.flush(mockResponse);
  });

  it('should get popular movies by genre and map urls', () => {
    const genreId = 28;
    const mockResponse: MovieSearchResponse = {
      page: 1,
      total_pages: 1,
      total_results: 1,
      results: [
        {
          id: 3,
          title: 'Genre Movie',
          poster_path: '/genre_poster.jpg',
          backdrop_path: '/genre_backdrop.jpg',
        } as any,
      ],
    };

    service.getPopularMoviesByGenre(genreId).subscribe((res) => {
      expect(res.results[0].poster_full_url).toBe(
        `${environment.tmdbImageBaseUrl}/genre_poster.jpg`
      );
      expect(res.results[0].backdrop_full_url).toBe(
        `${environment.tmdbImageBaseUrl}/genre_backdrop.jpg`
      );
    });

    const req = httpMock.expectOne(
      (r) =>
        r.method === 'GET' &&
        r.url === `${environment.tmdbBaseUrl}/discover/movie`
    );
    expect(req.request.params.get('with_genres')).toBe(String(genreId));
    req.flush(mockResponse);
  });

  it('should get upcoming movies and map urls', () => {
    const mockResponse: UpcomingResponse = {
      page: 1,
      total_pages: 1,
      total_results: 1,
      results: [
        {
          id: 4,
          title: 'Upcoming Movie',
          poster_path: '/up_poster.jpg',
          backdrop_path: '/up_backdrop.jpg',
        } as any,
      ],
    };

    service.getUpcomingMovies(1).subscribe((res) => {
      expect(res.results[0].poster_full_url).toBe(
        `${environment.tmdbImageBaseUrl}/up_poster.jpg`
      );
      expect(res.results[0].backdrop_full_url).toBe(
        `${environment.tmdbImageBaseUrl}/up_backdrop.jpg`
      );
    });

    const req = httpMock.expectOne(
      (r) =>
        r.method === 'GET' &&
        r.url === `${environment.tmdbBaseUrl}/movie/upcoming`
    );
    expect(req.request.params.get('page')).toBe('1');
    req.flush(mockResponse);
  });

  it('should get movie details by id and map urls', () => {
    const movieId = 5;
    const mockResponse: MovieDetails = {
      id: movieId,
      title: 'Details Movie',
      poster_path: '/details_poster.jpg',
      backdrop_path: '/details_backdrop.jpg',
    } as any;

    service.getMovieDetailsById(movieId).subscribe((res) => {
      expect(res).toBeDefined();
    });

    const req = httpMock.expectOne(
      `${environment.tmdbBaseUrl}/movie/${movieId}?api_key=${environment.tmdbApiKey}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get movie credits by id', () => {
    const movieId = 6;
    const mockResponse: MovieCreditsResponse = {
      id: movieId,
      cast: [],
      crew: [],
    };

    service.getMovieCreditsById(movieId).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      (r) =>
        r.method === 'GET' &&
        r.url === `${environment.tmdbBaseUrl}/movie/${movieId}/credits`
    );
    expect(req.request.params.get('api_key')).toBe(environment.tmdbApiKey);
    req.flush(mockResponse);
  });

  it('should get guest session id', () => {
    const mockResponse = { guest_session_id: 'abc123' };

    service.getGuestSessionId().subscribe((res) => {
      expect(res.guest_session_id).toBe('abc123');
    });

    const req = httpMock.expectOne(
      `${environment.tmdbBaseUrl}/authentication/guest_session/new?api_key=${environment.tmdbApiKey}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should post rate movie', () => {
    const movieId = 7;
    const rating = 8;
    const sessionId = 'session-1';

    service.rateMovie(movieId, rating, sessionId).subscribe((res) => {
      expect(res).toBeTruthy();
    });

    const req = httpMock.expectOne(
      `${environment.tmdbBaseUrl}/movie/${movieId}/rating?api_key=${environment.tmdbApiKey}&guest_session_id=${sessionId}`
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ value: rating });
    req.flush({ success: true });
  });
});
