import { SearchBarProps } from "../types";

export default function SearchBar({ searchQuery, query, value, onChange }: SearchBarProps) {
  const currentValue = value ?? query ?? searchQuery ?? "";
  return (
    <div className="header-search">
      <div className="search-input-wrapper">
        <svg
          className="search-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          type="text"
          id="search-input"
          className="search-input"
          placeholder="Search movies, plot keywords, titles..."
          onChange={(e) => onChange(e.target.value)}
          value={currentValue}
          autoComplete="off"
        />
        <button
          className="search-clear-btn"
          id="search-clear-btn"
          title="Clear search"
        >
          &times;
        </button>
      </div>
    </div>
  );
}
