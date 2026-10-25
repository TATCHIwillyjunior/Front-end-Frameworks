import { Grid2X2, List } from "lucide-react";
import type { MovieSort } from "../services/movieService";

interface FilterBarProps {
  genres: Record<number, string>;
  selectedGenre: number | null;
  onGenreChange: (genre: number | null) => void;
  sort: MovieSort;
  onSortChange: (sort: MovieSort) => void;
  view: "grid" | "list";
  onViewChange: (view: "grid" | "list") => void;
}

export default function FilterBar({
  genres,
  selectedGenre,
  onGenreChange,
  sort,
  onSortChange,
  view,
  onViewChange,
}: FilterBarProps) {
  return (
    <section aria-label="Movie filters" className="filter-bar">
      <div className="genre-pills-scroll">
        <button
          aria-pressed={selectedGenre === null}
          className={`genre-pill${selectedGenre === null ? " active" : ""}`}
          onClick={() => onGenreChange(null)}
          type="button"
        >
          All
        </button>
        {Object.entries(genres).map(([id, name]) => (
          <button
            aria-pressed={selectedGenre === Number(id)}
            className={`genre-pill${selectedGenre === Number(id) ? " active" : ""}`}
            key={id}
            onClick={() => onGenreChange(Number(id))}
            type="button"
          >
            {name}
          </button>
        ))}
      </div>
      <div className="filter-actions-right">
        <label className="sort-select-wrapper">
          <span className="sr-only">Sort movies</span>
          <select
            className="sort-select"
            onChange={(event) => onSortChange(event.target.value as MovieSort)}
            value={sort}
          >
            <option value="popularity">Popularity</option>
            <option value="vote_average">Rating</option>
            <option value="release_date">Release date</option>
            <option value="title">Title</option>
          </select>
        </label>
        <div aria-label="View mode" className="view-toggle-group">
          <button
            aria-label="Grid view"
            aria-pressed={view === "grid"}
            className={`view-btn${view === "grid" ? " active" : ""}`}
            onClick={() => onViewChange("grid")}
            type="button"
          >
            <Grid2X2 size={16} />
          </button>
          <button
            aria-label="List view"
            aria-pressed={view === "list"}
            className={`view-btn${view === "list" ? " active" : ""}`}
            onClick={() => onViewChange("list")}
            type="button"
          >
            <List size={17} />
          </button>
        </div>
      </div>
    </section>
  );
}
