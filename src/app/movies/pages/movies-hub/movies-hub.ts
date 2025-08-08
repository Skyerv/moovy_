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
} from 'rxjs';
import {
  MovieSearchQuery,
  createNewMovieSearchQuery,
  Movie,
} from '../../models/movie.interface';
import { MovieService } from '../../services/movie-service';
import { select, Store } from '@ngrx/store';
import {
  selectUpcomingMovies,
} from '../../store/movies.selectors';
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

  ngOnInit(): void {
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
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  onSearchInput(value: string): void {
    this.searchInput$.next(value);
  }

  onPageChange(event: PageEvent): void {
    this.searchQuery.page = event.pageIndex + 1;
    this.searchMovies();
  }

  searchMovies(): void {
    this.isLoading = true;

    this.movieService.searchMovies(this.searchQuery).subscribe({
      next: (response) => {
        this.resultMovies = response.results;
        this.totalResults = response.total_results;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.isLoading = false;
        console.log(error);
      },
    });
  }

  startAutoSlide() {
    clearInterval(this.intervalId);

    this.intervalId = setInterval(() => {
      if (this.carouselMovies.length > 1) {
        this.currentSlide =
          (this.currentSlide + 1) % this.carouselMovies.length;
      }
      this.cdr.detectChanges();
    }, 5000);
  }

  getTransform(): string {
    return `translateX(-${this.currentSlide * 100}%)`;
  }

  // ngOnDestroy(): void {
  //   this.sub.unsubscribe();
  //   clearInterval(this.intervalId);
  // }

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
        this.currentSlide = 0;

        clearInterval(this.intervalId);

        if (this.carouselMovies.length > 1) {
          this.startAutoSlide();
        }
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
