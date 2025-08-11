import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MovieDetailsDialog } from './movie-details-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MovieService } from '../../services/movie-service';
import { of } from 'rxjs';
import { environment } from 'environments/environment';

describe('MovieDetailsDialog', () => {
  let component: MovieDetailsDialog;
  let fixture: ComponentFixture<MovieDetailsDialog>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<MovieDetailsDialog>>;
  let mockMovieService: jasmine.SpyObj<MovieService>;

  beforeEach(async () => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    mockMovieService = jasmine.createSpyObj('MovieService', [
      'getMovieDetailsById',
      'getMovieCreditsById',
    ]);

    await TestBed.configureTestingModule({
      imports: [MovieDetailsDialog],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: 123 },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MovieService, useValue: mockMovieService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MovieDetailsDialog);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getMovieDetails on ngOnInit', () => {
    spyOn(component, 'getMovieDetails');
    component.ngOnInit();
    expect(component.getMovieDetails).toHaveBeenCalled();
  });

  it('should close dialog on onClose', () => {
    component.onClose();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should set movieDetails$ and movieCastAndCrew$ on getMovieDetails', () => {
    const details = { id: 123 } as any;
    const credits = { cast: [] } as any;
    mockMovieService.getMovieDetailsById.and.returnValue(of(details));
    mockMovieService.getMovieCreditsById.and.returnValue(of(credits));

    component.getMovieDetails();

    component.movieDetails$.subscribe((val) => {
      expect(val).toEqual(details);
    });
    component.movieCastAndCrew$.subscribe((val) => {
      expect(val).toEqual(credits);
    });
  });

  it('should return correct profile image url', () => {
    const path = '/img.jpg';
    expect(component.getProfileImage(path)).toBe(
      `${environment.tmdb200ImageBaseUrl}${path}`
    );
    expect(component.getProfileImage(null)).toBe(
      'assets/default-avatar-icon.jpg'
    );
  });

  it('should scroll actors row to the left', () => {
    const scrollBySpy = jasmine.createSpy('scrollBy');
    component.actorsRowRef = {
      nativeElement: { scrollBy: scrollBySpy },
    } as any;
    component.scrollActors('left');
    expect(scrollBySpy).toHaveBeenCalledWith({
      left: -component.scrollAmount,
      behavior: 'smooth',
    });
  });

  it('should scroll actors row to the right', () => {
    const scrollBySpy = jasmine.createSpy('scrollBy');
    component.actorsRowRef = {
      nativeElement: { scrollBy: scrollBySpy },
    } as any;
    component.scrollActors('right');
    expect(scrollBySpy).toHaveBeenCalledWith({
      left: component.scrollAmount,
      behavior: 'smooth',
    });
  });

  it('should not scroll if actorsRowRef is undefined', () => {
    component.actorsRowRef = undefined as any;
    expect(() => component.scrollActors('left')).not.toThrow();
  });
});
