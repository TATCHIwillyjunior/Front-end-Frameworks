import { useEffect, useState } from "react";
import {
  fetchMovies,
  type FetchMoviesResult,
  type MovieSort,
} from "../services/movieService";
import type { Movie } from "../types";

interface UseMoviesOptions {
  baseUrl: string;
  search: string;
  genre: number | null;
  page: number;
  onlyFavorites: boolean;
  sort: MovieSort;
  refreshKey: number;
}

interface UseMoviesResult extends FetchMoviesResult {
  loading: boolean;
  error: string | null;
}

export function useMovies({
  baseUrl,
  search,
  genre,
  page,
  onlyFavorites,
  sort,
  refreshKey,
}: UseMoviesOptions): UseMoviesResult {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLiveAPI, setIsLiveAPI] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadMovies() {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchMovies({
          baseUrl,
          search,
          genre,
          page,
          onlyFavorites,
          sort,
          signal: controller.signal,
        });
        if (!controller.signal.aborted) {
          setMovies(result.movies);
          setIsLiveAPI(result.isLiveAPI);
        }
      } catch (caught: unknown) {
        if (caught instanceof Error && caught.name === "AbortError") return;
        if (!controller.signal.aborted) {
          setError(
            caught instanceof Error
              ? caught.message
              : "An unexpected error occurred while fetching movies.",
          );
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadMovies();
    return () => controller.abort();
  }, [baseUrl, search, genre, page, onlyFavorites, sort, refreshKey]);

  return { movies, isLiveAPI, loading, error };
}
