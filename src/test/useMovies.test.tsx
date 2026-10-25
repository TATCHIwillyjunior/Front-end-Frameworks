import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useMovies } from "../hooks/useMovies";

const options = {
  baseUrl: "https://example.test",
  search: "",
  genre: null,
  page: 1,
  onlyFavorites: false,
  sort: "popularity" as const,
  refreshKey: 0,
};

function MoviesConsumer() {
  const { movies, loading, error, isLiveAPI } = useMovies(options);

  return (
    <div>
      {loading && <p role="status">Loading movies...</p>}
      {error && <p role="alert">{error}</p>}
      <p>{isLiveAPI ? "Live API" : "Local data"}</p>
      {movies.map((movie) => (
        <p key={movie.id}>{movie.title}</p>
      ))}
    </div>
  );
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  localStorage.clear();
});

describe("useMovies", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("loads movies using the stored TMDB v3 API key", async () => {
    localStorage.setItem("cinegrid_api_key", "test-token");
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ results: [{ id: 1, title: "Arrival" }] }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<MoviesConsumer />);

    expect(screen.getByRole("status")).toHaveTextContent("Loading movies...");
    expect(await screen.findByText("Arrival")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      "https://example.test/movie/popular?api_key=test-token&page=1",
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
    expect(screen.getByText("Live API")).toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("shows an error when TMDB responds with a failure status", async () => {
    localStorage.setItem("cinegrid_api_key", "test-token");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        statusText: "Unauthorized",
      }),
    );

    render(<MoviesConsumer />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "TMDB request failed: 401 Unauthorized",
    );
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("uses filtered local sample movies without an API key", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    render(<MoviesConsumer />);

    expect(await screen.findByText("Local data")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
