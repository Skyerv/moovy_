import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoviesHub } from './movies-hub';

describe('MoviesHub', () => {
  let component: MoviesHub;
  let fixture: ComponentFixture<MoviesHub>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoviesHub]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoviesHub);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
