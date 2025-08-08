import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { Movie } from 'movies/models/movie.interface';

@Component({
  selector: 'app-carousel',
  imports: [],
  templateUrl: './carousel.html',
  styleUrl: './carousel.scss',
})
export class Carousel {
  @Input() carouselMovies: Movie[] = [];

  currentSlide = 0;
  intervalId: any;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.startAutoSlide();
  }

  getTransform(): string {
    return `translateX(-${this.currentSlide * 100}%)`;
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

  ngOnChanges(): void {
    this.currentSlide = 0;
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }
}
