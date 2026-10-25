import { useCallback, useMemo, useState } from "react";
import ApiConfigModal from "../components/ApiConfigModal";
import FilterBar from "../components/FilterBar";
import Header from "../components/Header";
import MovieCard from "../components/MovieCard";
import MovieModal from "../components/MovieModal";
import StatsBanner from "../components/StatsBanner";
import { useGenres } from "../hooks/useGenres";
import { useMovies } from "../hooks/useMovies";
import { storage } from "../services/storage";
import type { Movie } from "../types";

export default function HomePage() {
  const baseUrl = import.meta.env.VITE_TMDB_BASE_URL ?? "";
  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [sort, setSort] = useState<"popularity" | "vote_average" | "release_date" | "title">("popularity");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">(storage.getTheme);
  const [favorites, setFavorites] = useState<Movie[]>(storage.getFavorites);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [apiConfigOpen, setApiConfigOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const { movies, loading, error, isLiveAPI } = useMovies({
    baseUrl,
    search,
    genre: selectedGenre,
    page: 1,
    onlyFavorites,
    sort,
    refreshKey,
  });
  const { genres, error: genresError } = useGenres(baseUrl, refreshKey);

  const favoriteIds = useMemo(
    () => new Set(favorites.map((movie) => String(movie.id))),
    [favorites],
  );

  const updateFavorites = useCallback((movie: Movie) => {
    setFavorites((current) => {
      const next = current.some((item) => String(item.id) === String(movie.id))
        ? current.filter((item) => String(item.id) !== String(movie.id))
        : [...current, movie];
      storage.setFavorites(next);
      return next;
    });
    if (onlyFavorites) setRefreshKey((key) => key + 1);
  }, [onlyFavorites]);

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    storage.setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  }

  function saveApiKey(apiKey: string) {
    storage.setApiKey(apiKey);
    setApiConfigOpen(false);
    setRefreshKey((key) => key + 1);
  }

  const averageRating = movies.length
    ? movies.reduce((total, movie) => total + (movie.vote_average ?? 0), 0) / movies.length
    : 0;
  const activeGenre = selectedGenre === null ? "All genres" : genres[selectedGenre] ?? "Selected";

  return (
    <div className="app-layout">
      <Header
        favCount={favorites.length}
        onOpenApiConfig={() => setApiConfigOpen(true)}
        onSearch={setSearch}
        onToggleFavorites={() => setOnlyFavorites((current) => !current)}
        onToggleTheme={toggleTheme}
        onlyFavorites={onlyFavorites}
        search={search}
        theme={theme}
      />
      <main className="main-container">
        <h1 className="sr-only">Movie browser</h1>
        <StatsBanner
          activeGenre={activeGenre}
          averageRating={averageRating}
          isLiveAPI={isLiveAPI}
          resultCount={movies.length}
        />
        <FilterBar
          genres={genres}
          onGenreChange={setSelectedGenre}
          onSortChange={setSort}
          onViewChange={setView}
          selectedGenre={selectedGenre}
          sort={sort}
          view={view}
        />
        {genresError && <p role="alert">{genresError}</p>}
        {loading ? (
          <p role="status">Loading movies...</p>
        ) : error ? (
          <p role="alert">{error}</p>
        ) : movies.length === 0 ? (
          <div className="empty-state">
            <p>No movies found.</p>
          </div>
        ) : (
          <div className={`movies-grid${view === "list" ? " compact-view" : ""}`}>
            {movies.map((movie) => (
              <MovieCard
                genres={genres}
                isFavorite={favoriteIds.has(String(movie.id))}
                key={movie.id}
                movie={movie}
                onSelect={() => setSelectedMovie(movie)}
                onToggleFavorite={() => updateFavorites(movie)}
              />
            ))}
          </div>
        )}
      </main>
      {selectedMovie && (
        <MovieModal
          genres={genres}
          isFavorite={favoriteIds.has(String(selectedMovie.id))}
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          onToggleFavorite={() => updateFavorites(selectedMovie)}
        />
      )}
      {apiConfigOpen && (
        <ApiConfigModal
          initialApiKey={storage.getApiKey()}
          onClose={() => setApiConfigOpen(false)}
          onSave={saveApiKey}
        />
      )}
    </div>
  );
}
