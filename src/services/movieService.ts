import { GENRES } from "../data/genres";
import { SAMPLE_MOVIES } from "../data/sampleMovies";
import type { Movie } from "../types";
import { storage } from "./storage";

export type MovieSort = "popularity" | "vote_average" | "release_date" | "title";

export interface FetchMoviesOptions {
  baseUrl: string;
  search: string;
  genre: number | null;
  page: number;
  onlyFavorites: boolean;
  sort: MovieSort;
  signal?: AbortSignal;
}

export interface FetchMoviesResult {
  movies: Movie[];
  isLiveAPI: boolean;
}

function filterMovies(
  movies: Movie[],
  search: string,
  genre: number | null,
): Movie[] {
  const normalizedSearch = search.trim().toLocaleLowerCase();
  return movies.filter((movie) => {
    const matchesSearch =
      !normalizedSearch || movie.title.toLocaleLowerCase().includes(normalizedSearch);
    const matchesGenre =
      genre === null || movie.genre_ids?.includes(genre) === true;
    return matchesSearch && matchesGenre;
  });
}

export function sortMovies(movies: Movie[], sort: MovieSort): Movie[] {
  return [...movies].sort((a, b) => {
    switch (sort) {
      case "vote_average":
        return (b.vote_average ?? 0) - (a.vote_average ?? 0);
      case "release_date":
        return (b.release_date ?? "").localeCompare(a.release_date ?? "");
      case "title":
        return a.title.localeCompare(b.title);
      case "popularity":
      default:
        return (b.popularity ?? 0) - (a.popularity ?? 0);
    }
  });
}

function isMovie(value: unknown): value is Movie {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    (typeof value.id === "number" || typeof value.id === "string") &&
    "title" in value &&
    typeof value.title === "string"
  );
}

export async function fetchMovies({
  baseUrl,
  search,
  genre,
  page,
  onlyFavorites,
  sort,
  signal,
}: FetchMoviesOptions): Promise<FetchMoviesResult> {
  if (onlyFavorites) {
    return {
      movies: sortMovies(filterMovies(storage.getFavorites(), search, genre), sort),
      isLiveAPI: false,
    };
  }

  const apiKey = storage.getApiKey();
  if (!apiKey) {
    const sampleMovies = filterMovies(SAMPLE_MOVIES, search, genre);
    return {
      movies: sortMovies(sampleMovies, sort),
      isLiveAPI: false,
    };
  }
  if (!baseUrl) {
    throw new Error("Missing VITE_TMDB_BASE_URL.");
  }

  const normalizedBaseUrl = baseUrl.replace(/\/$/, "");
  const endpoint = search.trim()
    ? `${normalizedBaseUrl}/search/movie`
    : genre === null
      ? `${normalizedBaseUrl}/movie/popular`
      : `${normalizedBaseUrl}/discover/movie`;
  const params = new URLSearchParams({ api_key: apiKey, page: String(page) });

  if (search.trim()) {
    params.set("query", search.trim());
  } else if (genre !== null) {
    params.set("with_genres", String(genre));
  }

  const response = await fetch(`${endpoint}?${params.toString()}`, { signal });
  if (!response.ok) {
    throw new Error(
      `TMDB request failed: ${response.status} ${response.statusText}`.trim(),
    );
  }

  const data: unknown = await response.json();
  if (
    typeof data !== "object" ||
    data === null ||
    !("results" in data) ||
    !Array.isArray(data.results) ||
    !data.results.every(isMovie)
  ) {
    throw new Error("TMDB returned an invalid movie list.");
  }

  return {
    movies: sortMovies(filterMovies(data.results, search, genre), sort),
    isLiveAPI: true,
  };
}

export async function fetchGenres(
  baseUrl: string,
  signal?: AbortSignal,
): Promise<Record<number, string>> {
  const apiKey = storage.getApiKey();
  if (!apiKey) return GENRES;
  if (!baseUrl) throw new Error("Missing VITE_TMDB_BASE_URL.");

  const params = new URLSearchParams({ api_key: apiKey });
  const response = await fetch(
    `${baseUrl.replace(/\/$/, "")}/genre/movie/list?${params.toString()}`,
    { signal },
  );
  if (!response.ok) {
    throw new Error(
      `TMDB genre request failed: ${response.status} ${response.statusText}`.trim(),
    );
  }

  const data: unknown = await response.json();
  if (
    typeof data !== "object" ||
    data === null ||
    !("genres" in data) ||
    !Array.isArray(data.genres) ||
    !data.genres.every(
      (genre) =>
        typeof genre === "object" &&
        genre !== null &&
        "id" in genre &&
        typeof genre.id === "number" &&
        "name" in genre &&
        typeof genre.name === "string",
    )
  ) {
    throw new Error("TMDB returned an invalid genre list.");
  }

  return Object.fromEntries(data.genres.map(({ id, name }) => [id, name]));
}
