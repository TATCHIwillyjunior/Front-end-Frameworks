import { useEffect, useState } from "react";
import { GENRES } from "../data/genres";
import { fetchGenres } from "../services/movieService";

export function useGenres(baseUrl: string, refreshKey: number) {
  const [genres, setGenres] = useState<Record<number, string>>(GENRES);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    async function loadGenres() {
      try {
        const result = await fetchGenres(baseUrl, controller.signal);
        if (!controller.signal.aborted) {
          setGenres(result);
          setError(null);
        }
      } catch (caught: unknown) {
        if (caught instanceof Error && caught.name === "AbortError") return;
        if (!controller.signal.aborted) {
          setError(
            caught instanceof Error
              ? caught.message
              : "An unexpected error occurred while fetching genres.",
          );
        }
      }
    }

    void loadGenres();
    return () => controller.abort();
  }, [baseUrl, refreshKey]);

  return { genres, error };
}
