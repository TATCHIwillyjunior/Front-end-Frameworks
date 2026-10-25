import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import MovieCard from "../components/MovieCard";
import { useGenres } from "../hooks/useGenres";
import type { Movie } from "../types";

const movie: Movie = {
  id: 1,
  title: "Arrival",
  genre_ids: [878, 18],
};

function GenresConsumer() {
  const { genres, error } = useGenres("https://example.test", 0);

  return (
    <div>
      {error && <p role="alert">{error}</p>}
      <MovieCard movie={movie} genres={genres} />
    </div>
  );
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  localStorage.clear();
});

describe("useGenres", () => {
  it("loads TMDB genres and displays the matching names on movies", async () => {
    localStorage.setItem("cinegrid_api_key", "test-token");
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        genres: [
          { id: 878, name: "Science Fiction" },
          { id: 18, name: "Drama" },
        ],
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<GenresConsumer />);

    expect(await screen.findByText("Science Fiction")).toBeInTheDocument();
    expect(screen.getByText("Drama")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      "https://example.test/genre/movie/list?api_key=test-token",
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it("reports genre request failures", async () => {
    localStorage.setItem("cinegrid_api_key", "test-token");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 503,
        statusText: "Service Unavailable",
      }),
    );

    render(<GenresConsumer />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "TMDB genre request failed: 503 Service Unavailable",
    );
  });
});
