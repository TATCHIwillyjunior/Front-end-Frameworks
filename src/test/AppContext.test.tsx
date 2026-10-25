import { StrictMode } from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { AppProvider, useAppContext } from "../context/AppContext";
import type { Movie } from "../types";

const movie: Movie = { id: 17, title: "Arrival" };

function Inspector() {
  const { favorites, toggleFavorite } = useAppContext();
  return (
    <>
      <span data-testid="count">{favorites.length}</span>
      <button onClick={() => toggleFavorite(movie)}>Toggle favorite</button>
    </>
  );
}

function OutsideConsumer() {
  useAppContext();
  return null;
}

afterEach(() => {
  cleanup();
  localStorage.clear();
});

describe("AppContext", () => {
  it("throws a clear error when used outside its provider", () => {
    expect(() => render(<OutsideConsumer />)).toThrow(
      "useAppContext must be used within an AppProvider.",
    );
  });

  it("keeps favorite toggling correct under React StrictMode", () => {
    render(
      <StrictMode>
        <AppProvider>
          <Inspector />
        </AppProvider>
      </StrictMode>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Toggle favorite" }));
    expect(screen.getByTestId("count")).toHaveTextContent("1");
    expect(JSON.parse(localStorage.getItem("cinegrid_favorites") ?? "[]"))
      .toHaveLength(1);
  });
});
