import { MovieCard } from './movie-card';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MovieDetailsDialog } from '../movie-details-dialog/movie-details-dialog';
import { Movie } from 'movies/models/movie.interface';

describe('MovieCard', () => {
  let component: MovieCard;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    component = new MovieCard(dialogSpy, routerSpy);
    component.movie = { id: 1, title: 'Test Movie' } as Movie;
  });

  it('should open dialog with correct config', () => {
    const afterClosedSpy = jasmine.createSpyObj('afterClosed', ['subscribe']);
    dialogSpy.open.and.returnValue({
      afterClosed: () => afterClosedSpy,
    } as any);

    component.openMovieDialog(1);

    expect(dialogSpy.open).toHaveBeenCalledWith(
      MovieDetailsDialog,
      jasmine.objectContaining({
        id: 'details-1',
        data: 1,
        width: '600px',
        panelClass: 'custom-dialog-container',
      })
    );
  });

  it('should navigate to details route after timeout if viaRoute is false', (done) => {
    spyOn(window, 'setTimeout').and.callFake(((
      handler: TimerHandler,
      timeout?: number,
      ...args: any[]
    ) => {
      if (typeof handler === 'function') {
        handler(...args);
      } else {
        eval(handler as string);
      }
      return 0;
    }) as any);

    const afterClosedSpy = jasmine.createSpyObj('afterClosed', ['subscribe']);

    dialogSpy.open.and.returnValue({
      afterClosed: () => afterClosedSpy,
    } as any);

    component.openMovieDialog(2, false);

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/movies', 2, 'details']);
    done();
  });

  it('should not navigate to details route if viaRoute is true', () => {
    spyOn(window, 'setTimeout').and.callFake(((
      handler: TimerHandler,
      timeout?: number,
      ...args: any[]
    ) => {
      if (typeof handler === 'function') {
        handler(...args);
      } else {
        eval(handler as string);
      }
      return 0;
    }) as any);

    const afterClosedSpy = jasmine.createSpyObj('afterClosed', ['subscribe']);

    dialogSpy.open.and.returnValue({
      afterClosed: () => afterClosedSpy,
    } as any);

    component.openMovieDialog(3, true);

    expect(routerSpy.navigate).not.toHaveBeenCalledWith([
      '/movies',
      3,
      'details',
    ]);
  });

  it('should navigate to /movies after dialog is closed', () => {
    const afterClosedSpy = jasmine.createSpyObj('afterClosed', ['subscribe']);

    dialogSpy.open.and.returnValue({
      afterClosed: () => afterClosedSpy,
    } as any);

    component.openMovieDialog(4);

    expect(afterClosedSpy.subscribe).toHaveBeenCalled();

    const callback = afterClosedSpy.subscribe.calls.argsFor(0)[0];

    callback();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/movies']);
  });
});
