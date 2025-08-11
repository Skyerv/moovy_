import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Carousel } from './carousel';
import { ChangeDetectorRef } from '@angular/core';

describe('Carousel', () => {
  let component: Carousel;
  let fixture: ComponentFixture<Carousel>;
  let cdrSpy: jasmine.SpyObj<ChangeDetectorRef>;
  let fakeIntervalId: any;

  beforeEach(async () => {
    cdrSpy = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);

    await TestBed.configureTestingModule({
      imports: [Carousel],
    }).compileComponents();

    fakeIntervalId = 4;

    fixture = TestBed.createComponent(Carousel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize currentSlide to 0', () => {
    expect(component.currentSlide).toBe(0);
  });

  it('should set carouselMovies via @Input and reset currentSlide on ngOnChanges', () => {
    component.carouselMovies = [{ id: 1, title: 'Movie 1' } as any];
    component.currentSlide = 2;
    component.ngOnChanges();
    expect(component.currentSlide).toBe(0);
  });

  it('should return correct transform style', () => {
    component.currentSlide = 2;
    expect(component.getTransform()).toBe('translateX(-200%)');
  });

  it('should clear previous interval and set a new interval', (done) => {
    spyOn(window, 'clearInterval').and.callFake(() => {});
    spyOn(window, 'setInterval').and.callFake((fn: any) => {
      fakeIntervalId = 40;
      setTimeout(fn, 0); 
      return fakeIntervalId;
    });

    component.startAutoSlide();

    expect(setInterval).toHaveBeenCalled();
    expect(component.intervalId).toBe(fakeIntervalId);

    setTimeout(() => {
      expect(component.currentSlide).toBe(0);
      done();
    }, 10);
  });

  it('should not advance slide if carouselMovies length <= 1', (done) => {
    spyOn(window, 'clearInterval').and.callFake(() => {});
    spyOn(window, 'setInterval').and.callFake((fn: any) => {
      fakeIntervalId = 24;
      setTimeout(fn, 0); 
      return fakeIntervalId;
    });

    component.carouselMovies = [{
      adult: false,
      backdrop_path: null,
      genre_ids: [],
      id: 0,
      original_title: '',
      overview: '',
      popularity: 0,
      poster_path: null,
      release_date: '',
      title: '',
      vote_average: 0,
      vote_count: 0
    }]; 
    component.currentSlide = 0;

    component.startAutoSlide();

    setTimeout(() => {
      expect(component.currentSlide).toBe(0);
      done();
    }, 10);
  });

  it('should clear interval on ngOnDestroy', () => {
    spyOn(window, 'clearInterval');
    component.ngOnDestroy();
    expect(window.clearInterval).toHaveBeenCalledWith(component.intervalId);
  });
});
