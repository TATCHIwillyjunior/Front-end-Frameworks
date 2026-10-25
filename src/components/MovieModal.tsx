import { useEffect } from "react";
import { Heart, X, Youtube } from "lucide-react";
import type { Movie } from "../types";
import {
  getBackdropUrl,
  getPlaceholderBackdrop,
  getPosterUrl,
} from "../data/sampleMovies";
import { useOptionalAppContext } from "../context/AppContext";

interface MovieModalProps {
  movie: Movie;
  genres?: Record<number, string>;
  onClose: () => void;
}

export default function MovieModal({
  movie,
  genres = {},
  onClose,
}: MovieModalProps) {
  const appContext = useOptionalAppContext();
  const isFavorite = appContext?.isFavorite(movie.id) ?? false;
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  const backdrop = getBackdropUrl(movie.backdrop_path) || getPlaceholderBackdrop();
  const movieGenres = movie.genre_ids
    ?.map((id) => genres[id])
    .filter((name): name is string => Boolean(name));

  return (
    <div
      className="modal-overlay active"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      role="presentation"
    >
      <section
        aria-labelledby="movie-modal-title"
        aria-modal="true"
        className="modal-dialog"
        role="dialog"
      >
        <button
          aria-label="Close movie details"
          className="modal-close-btn"
          onClick={onClose}
          type="button"
        >
          <X size={20} />
        </button>
        <div
          aria-hidden="true"
          className="modal-backdrop-hero"
          style={{ backgroundImage: `url("${backdrop}")` }}
        />
        <div className="modal-body">
          <img
            alt={`${movie.title} poster`}
            className="modal-poster"
            src={getPosterUrl(movie.poster_path)}
          />
          <div className="modal-content-details">
            <h2 className="modal-title" id="movie-modal-title">{movie.title}</h2>
            {movie.original_title && movie.original_title !== movie.title && (
              <p className="modal-original-title">{movie.original_title}</p>
            )}
            <div className="modal-meta-row">
              <span className="modal-meta-item">
                Rating: {movie.vote_average?.toFixed(1) ?? "N/A"}
              </span>
              <span className="modal-meta-item">
                Release date: {movie.release_date || "Unknown"}
              </span>
            </div>
            <div className="movie-genres-tags">
              {movieGenres?.map((genre) => (
                <span className="genre-tag" key={genre}>{genre}</span>
              ))}
            </div>
            <div>
              <h3 className="modal-overview-heading">Overview</h3>
              <p className="modal-overview">{movie.overview || "No overview available."}</p>
            </div>
            <div className="modal-footer-actions">
              {appContext && (
                <button
                  aria-pressed={isFavorite}
                  className="btn-primary"
                  onClick={() => appContext.toggleFavorite(movie)}
                  type="button"
                >
                  <Heart size={17} />
                  {isFavorite ? "Remove from watchlist" : "Add to watchlist"}
                </button>
              )}
              <a
                className="btn-secondary"
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${movie.title} trailer`)}`}
                rel="noreferrer"
                target="_blank"
              >
                <Youtube size={17} />
                Watch trailer
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
