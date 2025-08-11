import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { MoviesHub } from './movies-hub';
import { MovieService } from '../../services/movie-service';
import {
  ChangeDetectorRef,
  ElementRef,
  NO_ERRORS_SCHEMA,
  QueryList,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { of, Subject, Subscription } from 'rxjs';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { loadUpcomingMovies } from '../../store/movies.actions';
import { MovieSearchResponse } from 'movies/models/movie.interface';
import { Carousel } from 'movies/components/carousel/carousel';
import {
  MatFormField,
  MatInputModule,
  MatLabel,
} from '@angular/material/input';
import { FormsModule } from '@angular/forms';

const searchMoviesMockResponse: MovieSearchResponse = {
  results: [
    {
      id: 1,
      title: 'Movie 1',
      adult: false,
      backdrop_path: null,
      genre_ids: [],
      original_title: '',
      overview: '',
      popularity: 0,
      poster_path: null,
      release_date: '',
      vote_average: 0,
      vote_count: 0,
    },
    {
      id: 2,
      title: 'Movie 2',
      adult: false,
      backdrop_path: null,
      genre_ids: [],
      original_title: '',
      overview: '',
      popularity: 0,
      poster_path: null,
      release_date: '',
      vote_average: 0,
      vote_count: 0,
    },
  ],
  total_results: 2,
  page: 1,
  total_pages: 1,
};

describe('MoviesHub', () => {
  let component: MoviesHub;
  let fixture: ComponentFixture<MoviesHub>;
  let movieServiceSpy: jasmine.SpyObj<MovieService>;
  let storeSpy: jasmine.SpyObj<Store>;
  let cdrSpy: jasmine.SpyObj<ChangeDetectorRef>;

  beforeEach(async () => {
    movieServiceSpy = jasmine.createSpyObj('MovieService', [
      'searchMovies',
      'getPopularMovies',
      'getPopularMoviesByGenre',
    ]);
    storeSpy = jasmine.createSpyObj('Store', ['select', 'dispatch']);
    cdrSpy = jasmine.createSpyObj('ChangeDetectorRef', [
      'detectChanges',
      'markForCheck',
    ]);

    movieServiceSpy.getPopularMoviesByGenre.and.returnValue(
      of({
        results: searchMoviesMockResponse.results,
        total_results: searchMoviesMockResponse.total_results,
        total_pages: searchMoviesMockResponse.total_pages,
        page: searchMoviesMockResponse.page,
      })
    );

    storeSpy.select.and.returnValue(of(searchMoviesMockResponse.results));

    await TestBed.configureTestingModule({
      imports: [
        Carousel,
        MatFormField,
        MatPaginatorModule,
        MatLabel,
        FormsModule,
        MatInputModule,
      ],
      declarations: [MoviesHub],
      providers: [
        { provide: MovieService, useValue: movieServiceSpy },
        { provide: ChangeDetectorRef, useValue: cdrSpy },
        { provide: Store, useValue: storeSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MoviesHub);
    component = fixture.componentInstance;
    component['searchInput$'] = new Subject<string>();

    component.movieSubscription = {
      unsubscribe: jasmine.createSpy('unsubscribe'),
    } as unknown as Subscription;

    fixture.detectChanges();

    component.paginator = {
      firstPage: jasmine.createSpy('firstPage'),
    } as any;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngAfterViewInit', () => {
    it('should call getUpcomingMovies and loadCategorizedPopularMovies', () => {
      spyOn(component, 'getUpcomingMovies');
      spyOn(component, 'loadCategorizedPopularMovies');
      component.ngAfterViewInit();
      component.searchInput$.next('batman');

      expect(component.getUpcomingMovies).toHaveBeenCalled();
      expect(component.loadCategorizedPopularMovies).toHaveBeenCalled();
    });

    it('should handle search input with term length >= 3', fakeAsync(() => {
      component.paginator = {
        firstPage: jasmine.createSpy('firstPage'),
      } as any;

      spyOn(component, 'searchMovies');

      component.ngAfterViewInit();
      component.searchInput$.next('test');

      component.onSearchInput('test');

      tick(400);

      expect(component.lastSearchTerm).toBe('test');
      expect(component.paginator.firstPage).toHaveBeenCalled();
      expect(component.searchMovies).toHaveBeenCalled();
    }));

    it('should handle search input with term length < 3', fakeAsync(() => {
      spyOn(component, 'loadCategorizedPopularMovies');
      component.ngAfterViewInit();
      component.searchInput$.next('te');

      component.onSearchInput('te');
      tick(400);
      expect(component.lastSearchTerm).toBe('te');
      expect(component.resultMovies).toEqual([]);
      expect(component.totalResults).toBe(0);
      expect(component.loadCategorizedPopularMovies).toHaveBeenCalled();
    }));
  });

  describe('onPageChange', () => {
    it('should update pageIndex and pageSize and call searchMovies', () => {
      spyOn(component, 'searchMovies');
      const event = { pageIndex: 2, pageSize: 12 } as any;
      component.onPageChange(event);
      expect(component.pageIndex).toBe(2);
      expect(component.pageSize).toBe(12);
      expect(component.searchMovies).toHaveBeenCalled();
    });
  });

  describe('searchMovies', () => {
    it('should set isLoading and update resultMovies on success', fakeAsync(() => {
      movieServiceSpy.searchMovies.and.returnValue(
        of(searchMoviesMockResponse)
      );
      component.pageSize = 2;
      component.pageIndex = 0;
      component.searchQuery = { query: 'test', page: 1 };
      component.searchMovies();
      tick();
      expect(component.isLoading).toBe(false);
      expect(component.resultMovies.length).toBe(2);
      expect(component.totalResults).toBe(2);
    }));

    it('should handle error', fakeAsync(() => {
      movieServiceSpy.searchMovies.and.returnValue(
        of({ results: [], total_results: 0, page: 1, total_pages: 1 })
      );
      spyOn(console, 'error');
      component.pageSize = 2;
      component.pageIndex = 0;
      component.searchQuery = { query: 'test', page: 1 };
      component.searchMovies();
      tick();
      expect(component.isLoading).toBe(false);
    }));
  });

  describe('getTransform', () => {
    it('should return correct transform string', () => {
      component.currentSlide = 2;
      expect(component.getTransform()).toBe('translateX(-200%)');
    });
  });

  describe('getPopularMovies', () => {
    it('should set popularMovies if not already set', () => {
      const mockResponse = { results: [{ id: 1 }] };
      movieServiceSpy.getPopularMovies.and.returnValue(
        of(searchMoviesMockResponse)
      );
      component.popularMovies = undefined as any;
      component.getPopularMovies();
      expect(component.popularMovies).toEqual([
        searchMoviesMockResponse.results[0],
        searchMoviesMockResponse.results[1],
      ]);
    });
  });

  describe('loadCategorizedPopularMovies', () => {
    it('should load movies for each genre', () => {
      movieServiceSpy.getPopularMoviesByGenre.and.returnValue(
        of(searchMoviesMockResponse)
      );
      component.loadCategorizedPopularMovies();
      for (const genre of Object.keys(component.GENRES)) {
        expect(component.categorizedMovies[genre]).toEqual(
          [
            searchMoviesMockResponse.results[0],
            searchMoviesMockResponse.results[1],
          ].slice(0, 10)
        );
      }
    });
  });

  describe('getUpcomingMovies', () => {
    it('should dispatch loadUpcomingMovies and set upcomingMovies', () => {
      storeSpy.select.and.returnValue(of(searchMoviesMockResponse.results));
      component.getUpcomingMovies();
      expect(storeSpy.dispatch).toHaveBeenCalledWith(loadUpcomingMovies());
      expect(component.upcomingMovies).toEqual(
        searchMoviesMockResponse.results
      );
      expect(component.carouselMovies).toEqual([]);
    });
  });

  describe('scrollGenre', () => {
    it('should scroll the genre row element', () => {
      const mockScrollBy = jasmine.createSpy('scrollBy');

      const nativeElement = {
        dataset: { genre: 'Action' },
        scrollBy: mockScrollBy,
      };

      const genreRow = { nativeElement } as ElementRef;

      component.genreRows = {
        find: (fn: any) => (fn(genreRow) ? genreRow : undefined),
      } as any;

      component.scrollGenre('Action', 'right');

      expect(mockScrollBy).toHaveBeenCalledWith({
        left: 300,
        behavior: 'smooth',
      });
    });

    it('should scroll the genre row element to the left', () => {
      const mockScrollBy = jasmine.createSpy('scrollBy');

      const nativeElement = {
        dataset: { genre: 'Action' },
        scrollBy: mockScrollBy,
      };

      const genreRow = { nativeElement } as ElementRef;

      component.genreRows = {
        find: (fn: any) => (fn(genreRow) ? genreRow : undefined),
      } as any;

      component.scrollGenre('Action', 'left');

      expect(mockScrollBy).toHaveBeenCalledWith({
        left: -300,
        behavior: 'smooth',
      });
    });
  });
});
