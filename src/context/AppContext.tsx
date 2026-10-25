import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type ReactNode,
} from "react";
import type { Movie } from "../types";
import { storage } from "../services/storage";

type Theme = "dark" | "light";

interface AppState {
  favorites: Movie[];
  theme: Theme;
}

type AppAction =
  | { type: "TOGGLE_FAVOURITE"; payload: Movie }
  | { type: "SET_THEME"; payload: Theme };

interface AppContextValue extends AppState {
  toggleFavorite: (movie: Movie) => void;
  isFavorite: (id: Movie["id"]) => boolean;
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);
const processedFavoriteActions = new WeakMap<AppAction, AppState>();

function createInitialState(): AppState {
  return {
    favorites: storage.getFavorites(),
    theme: storage.getTheme(),
  };
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "TOGGLE_FAVOURITE": {
      const processedState = processedFavoriteActions.get(action);
      if (processedState) return processedState;

      storage.toggleFavorite(action.payload);
      const nextState = { ...state, favorites: storage.getFavorites() };
      processedFavoriteActions.set(action, nextState);
      return nextState;
    }
    case "SET_THEME":
      return { ...state, theme: action.payload };
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, undefined, createInitialState);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", state.theme);
    storage.setTheme(state.theme);
  }, [state.theme]);

  const value: AppContextValue = {
    ...state,
    toggleFavorite: (movie) =>
      dispatch({ type: "TOGGLE_FAVOURITE", payload: movie }),
    isFavorite: (id) =>
      state.favorites.some(
        (movie) => String(movie.id) === String(id),
      ),
    toggleTheme: () =>
      dispatch({
        type: "SET_THEME",
        payload: state.theme === "dark" ? "light" : "dark",
      }),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext(): AppContextValue {
  const context = useContext(AppContext);
  if (context === null) {
    throw new Error("useAppContext must be used within an AppProvider.");
  }
  return context;
}

export function useOptionalAppContext(): AppContextValue | null {
  return useContext(AppContext);
}
