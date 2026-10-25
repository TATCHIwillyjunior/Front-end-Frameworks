import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchMovies, sortMovies } from "../services/movieService";
import type { Movie } from "../types";

const movies: Movie[] = [
  { id: 1, title: "Zulu", popularity: 2, vote_average: 8, genre_ids: [28] },
  { id: 2, title: "Arrival", popularity: 10, vote_average: 7, genre_ids: [878] },
];

afterEach(() => {
  vi.unstubAllGlobals();
  localStorage.clear();
});

describe("movieService", () => {
  it("sorts movies by title without mutating the input", () => {
    const sorted = sortMovies(movies, "title");
    expect(sorted.map((movie) => movie.title)).toEqual(["Arrival", "Zulu"]);
    expect(movies[0].title).toBe("Zulu");
  });

  it("uses the genre discovery endpoint and stored key", async () => {
    localStorage.setItem("cinegrid_api_key", "test key");
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ results: [movies[0]] }),
    });
    vi.stubGlobal("fetch", fetchMock);

    await fetchMovies({
      baseUrl: "https://api.example.test/3/",
      search: "",
      genre: 28,
      page: 2,
      onlyFavorites: false,
      sort: "popularity",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.example.test/3/discover/movie?api_key=test+key&page=2&with_genres=28",
      expect.any(Object),
    );
  });

  it("uses search endpoint and skips requests for favorites", async () => {
    localStorage.setItem("cinegrid_api_key", "test-key");
    localStorage.setItem("cinegrid_favorites", JSON.stringify(movies));
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ results: [] }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await fetchMovies({
      baseUrl: "https://api.example.test/3",
      search: "Zulu",
      genre: null,
      page: 1,
      onlyFavorites: true,
      sort: "title",
    });

    expect(result.movies.map((movie) => movie.title)).toEqual(["Zulu"]);
    expect(result.isLiveAPI).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();

    await fetchMovies({
      baseUrl: "https://api.example.test/3",
      search: "A film & more",
      genre: null,
      page: 1,
      onlyFavorites: false,
      sort: "title",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.example.test/3/search/movie?api_key=test-key&page=1&query=A+film+%26+more",
      expect.any(Object),
    );
  });
});
