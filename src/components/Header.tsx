import { Heart, Moon, Search, Settings, Sun, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

interface HeaderProps {
  search: string;
  onSearch: (value: string) => void;
  onlyFavorites: boolean;
  onToggleFavorites: () => void;
  onOpenApiConfig: () => void;
}

export default function Header({
  search,
  onSearch,
  onlyFavorites,
  onToggleFavorites,
  onOpenApiConfig,
}: HeaderProps) {
  const { theme, toggleTheme, favorites } = useAppContext();

  return (
    <header className="site-header">
      <div className="header-inner">
        <NavLink className="brand-logo" to="/" end>
          <span className="logo-dot" />
          <span className="logo-text">CineGrid</span>
        </NavLink>
        <nav aria-label="Main navigation" className="header-nav">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>
        <div className="header-search">
          <div className="search-input-wrapper">
            <Search className="search-icon" aria-hidden="true" />
            <input
              aria-label="Search movies"
              className="search-input"
              onChange={(event) => onSearch(event.target.value)}
              placeholder="Search movies..."
              value={search}
            />
            {search && (
              <button
                aria-label="Clear search"
                className="search-clear-btn"
                onClick={() => onSearch("")}
                type="button"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
        <div className="header-actions">
          <button
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            className="theme-toggle-btn"
            onClick={toggleTheme}
            type="button"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            aria-pressed={onlyFavorites}
            className={`btn-icon-label${onlyFavorites ? " active" : ""}`}
            onClick={onToggleFavorites}
            type="button"
          >
            <Heart size={17} />
            <span>Favorites</span>
            <span className="count-badge">{favorites.length}</span>
          </button>
          <button
            className="btn-icon-label"
            onClick={onOpenApiConfig}
            type="button"
          >
            <Settings size={17} />
            <span>API Key</span>
          </button>
        </div>
      </div>
    </header>
  );
}
