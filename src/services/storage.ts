import type { Movie } from "../types";

const API_KEY_STORAGE_KEY = "cinegrid_api_key";
const FAVORITES_STORAGE_KEY = "cinegrid_favorites";
const THEME_STORAGE_KEY = "cinegrid_theme";

export const storage = {
  getApiKey(): string {
    return localStorage.getItem(API_KEY_STORAGE_KEY) ?? "";
  },

  setApiKey(apiKey: string): void {
    localStorage.setItem(API_KEY_STORAGE_KEY, apiKey.trim());
  },

  getFavorites(): Movie[] {
    const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!stored) return [];

    const value: unknown = JSON.parse(stored);
    if (
      !Array.isArray(value) ||
      !value.every(
        (movie) =>
          typeof movie === "object" &&
          movie !== null &&
          "id" in movie &&
          (typeof movie.id === "number" || typeof movie.id === "string") &&
          "title" in movie &&
          typeof movie.title === "string",
      )
    ) {
      throw new Error("Saved favorites have an invalid format.");
    }
    return value;
  },

  setFavorites(movies: Movie[]): void {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(movies));
  },

  toggleFavorite(movie: Movie): void {
    const favorites = this.getFavorites();
    const nextFavorites = favorites.some(
      (favorite) => String(favorite.id) === String(movie.id),
    )
      ? favorites.filter(
          (favorite) => String(favorite.id) !== String(movie.id),
        )
      : [...favorites, movie];
    this.setFavorites(nextFavorites);
  },

  getTheme(): "dark" | "light" {
    return localStorage.getItem(THEME_STORAGE_KEY) === "light" ? "light" : "dark";
  },

  setTheme(theme: "dark" | "light"): void {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  },
};
