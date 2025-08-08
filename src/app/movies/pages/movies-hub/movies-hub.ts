import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import {
  Observable,
  Subject,
  Subscription,
  debounceTime,
  distinctUntilChanged,
  forkJoin,
} from 'rxjs';
import {
  MovieSearchQuery,
  createNewMovieSearchQuery,
  Movie,
} from '../../models/movie.interface';
import { MovieService } from '../../services/movie-service';
import { select, Store } from '@ngrx/store';
import { selectUpcomingMovies } from '../../store/movies.selectors';
import { loadMovies, loadUpcomingMovies } from '../../store/movies.actions';

@Component({
  selector: 'app-movies-hub',
  standalone: false,
  templateUrl: './movies-hub.html',
  styleUrl: './movies-hub.scss',
})
export class MoviesHub {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChildren('genreRowRef') genreRows!: QueryList<ElementRef>;

  private searchInput$ = new Subject<string>();

  searchQuery: MovieSearchQuery = createNewMovieSearchQuery();
  totalResults = 0;
  isLoading: boolean = false;

  pageIndex: number = 0;
  pageSize: number | undefined = 24;
  pageSizeOptions: number[] = [6, 12, 18, 24];

  popularMovies!: Movie[];
  upcomingMovies!: Movie[];
  carouselMovies: Movie[] = [];
  resultMovies: Movie[] = [];
  categorizedMovies: { [genre: string]: Movie[] } = {};

  upcomingMovies$!: Observable<Movie[]>;
  loading$!: Observable<boolean>;
  error$!: Observable<string | null>;

  readonly GENRES: { [name: string]: number } = {
    Action: 28,
    Comedy: 35,
    Drama: 18,
    'Sci-fi': 878,
    Horror: 27,
  };

  lastSearchTerm: string = '';

  currentSlide = 0;
  intervalId: any;

  selectedMovieIds = new Set<number>();
  hoveredMovieId: number | null = null;

  private sub!: Subscription;
  movieKeys: string[] = [];
  movieSubscription!: Subscription;

  constructor(
    private movieService: MovieService,
    private cdr: ChangeDetectorRef,
    private store: Store
  ) {
    this.upcomingMovies$ = this.store.select(selectUpcomingMovies);
    // this.loading$ = this.store.select(selectLoading);
    // this.error$ = this.store.select(selectError);
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.getUpcomingMovies();
    this.loadCategorizedPopularMovies();

    this.searchInput$
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((term) => {
        this.lastSearchTerm = term;

        if (term.length >= 3) {
          this.searchQuery = { query: term, page: 1 };
          this.paginator.firstPage();
          this.searchMovies();
        } else {
          this.resultMovies = [];
          this.totalResults = 0;

          this.loadCategorizedPopularMovies();
        }
      });

    this.cdr.detectChanges();
  }

  onSearchInput(value: string): void {
    this.searchInput$.next(value);
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    //this.searchQuery.page = event.pageIndex + 1;

    this.searchMovies();
  }

  searchMovies(): void {
    this.isLoading = true;

    const tmdbPageSize = 20;
    const pagesNeeded = Math.ceil(this.pageSize! / tmdbPageSize);

    const startPage =
      this.pageIndex * Math.ceil(this.pageSize! / tmdbPageSize) + 1;

    let allResults: Movie[] = [];

    let requests: Observable<any>[] = [];
    for (let i = 0; i < pagesNeeded; i++) {
      requests.push(
        this.movieService.searchMovies({
          query: this.searchQuery.query,
          page: startPage + i,
        })
      );
    }

    forkJoin(requests).subscribe({
      next: (responses) => {
        responses.forEach((res) => {
          allResults = allResults.concat(res.results);
          this.totalResults = res.total_results;
        });

        this.resultMovies = allResults.slice(0, this.pageSize);
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        console.error(error);
      },
    });
  }

  getTransform(): string {
    return `translateX(-${this.currentSlide * 100}%)`;
  }

  getPopularMovies(): void {
    this.movieService.getPopularMovies().subscribe((response) => {
      if (!this.popularMovies) {
        this.popularMovies = response.results;
      }
    });
  }

  loadCategorizedPopularMovies(): void {
    for (const [genreName, genreId] of Object.entries(this.GENRES)) {
      this.movieService.getPopularMoviesByGenre(genreId).subscribe({
        next: (response) => {
          this.categorizedMovies[genreName] = response.results.slice(0, 10);
          this.movieKeys = Object.keys(this.categorizedMovies);
          this.cdr.detectChanges();
        },
        error: (err) =>
          console.error(`Error loading ${genreName} movies.`, err),
      });
    }
  }

  getUpcomingMovies(): void {
    this.store.dispatch(loadUpcomingMovies());

    this.movieSubscription = this.store
      .select(selectUpcomingMovies)
      .subscribe((movies) => {
        if (!movies || movies.length === 0) return;

        this.upcomingMovies = movies;
        const validMovies = this.upcomingMovies.filter((m) => m.backdrop_path);

        this.carouselMovies = validMovies;

        this.cdr.markForCheck();
      });
  }

  scrollGenre(genre: string, direction: 'left' | 'right') {
    const rowElement = this.genreRows.find(
      (el) => el.nativeElement.dataset.genre === genre
    );

    if (rowElement) {
      const scrollAmount = 300;
      rowElement.nativeElement.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  }
}
