import { Movie } from "../models/movie.interface";

export interface MoviesState {
  movies: Movie[];
  selectedMovieId: number | null;
  loading: boolean;
  error: string | null;
}

export const initialState: MoviesState = {
  movies: [],
  selectedMovieId: null,
  loading: false,
  error: null,
};
